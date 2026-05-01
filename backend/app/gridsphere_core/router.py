"""GridSphere Core — command centre, tenant management, and deployment control.

GET  /api/v1/gridsphere/overview               → aggregated command centre KPIs
GET  /api/v1/gridsphere/tenants                → all tenants with active products
GET  /api/v1/gridsphere/tenants/{tid}/config   → tenant infra config
POST /api/v1/gridsphere/deploy/tenant          → provision new tenant environment
POST /api/v1/gridsphere/deploy/product         → activate a product for a tenant
GET  /api/v1/gridsphere/events                 → system event log
"""

import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.events import CLIENT_STATUS_CHANGED, PRODUCT_ACTIVATED, publish
from app.db.models import AgentRun, Client, ClientProduct, SystemEvent, TenantConfig
from app.db.session import get_db

router = APIRouter(prefix="/gridsphere", tags=["gridsphere-core"])


# ── Overview / Command Centre KPIs ─────────────────────────────────────────────

@router.get("/overview")
def command_centre_overview(db: Session = Depends(get_db)) -> dict:
    """Aggregate snapshot for the Command Centre dashboard."""
    total_tenants = db.scalar(select(func.count(Client.id))) or 0
    active_tenants = db.scalar(
        select(func.count(Client.id)).where(Client.onboarding_status == "active")
    ) or 0

    # Revenue across all active clients (deal_value as proxy for ARR)
    total_arr = db.scalar(
        select(func.sum(Client.deal_value)).where(Client.onboarding_status == "active")
    ) or 0.0

    # Product distribution (provisioned products per slug)
    product_counts: dict[str, int] = {}
    for cp in db.scalars(select(ClientProduct).where(ClientProduct.provisioned.is_(True))).all():
        product_counts[cp.product_slug] = product_counts.get(cp.product_slug, 0) + 1

    # Agent runs — last 24 h
    yesterday = datetime.now(timezone.utc) - timedelta(hours=24)
    agent_runs_24h = db.scalar(
        select(func.count(AgentRun.id)).where(AgentRun.created_at >= yesterday)
    ) or 0
    agent_failures_24h = db.scalar(
        select(func.count(AgentRun.id)).where(
            AgentRun.created_at >= yesterday,
            AgentRun.status == "failed",
        )
    ) or 0

    # 10 most recent agent runs
    recent_runs = db.scalars(
        select(AgentRun).order_by(AgentRun.created_at.desc()).limit(10)
    ).all()

    # 5 most recent system events
    recent_events = db.scalars(
        select(SystemEvent).order_by(SystemEvent.created_at.desc()).limit(5)
    ).all()

    return {
        "totalTenants": total_tenants,
        "activeTenants": active_tenants,
        "totalArr": total_arr,
        "productDistribution": product_counts,
        "agentRuns24h": agent_runs_24h,
        "agentFailures24h": agent_failures_24h,
        "recentAgentRuns": [
            {
                "id": r.id,
                "agentType": r.agent_type,
                "status": r.status,
                "tenantId": r.tenant_id,
                "durationMs": r.duration_ms,
                "createdAt": r.created_at.isoformat() if r.created_at else None,
            }
            for r in recent_runs
        ],
        "recentEvents": [
            {
                "id": e.id,
                "eventName": e.event_name,
                "tenantId": e.tenant_id,
                "processed": e.processed,
                "createdAt": e.created_at.isoformat() if e.created_at else None,
            }
            for e in recent_events
        ],
    }


# ── Tenant Management ──────────────────────────────────────────────────────────

@router.get("/tenants")
def list_tenants(db: Session = Depends(get_db)) -> list[dict]:
    """All tenants with their active products and plan info."""
    clients = db.scalars(
        select(Client)
        .options(selectinload(Client.products), selectinload(Client.plan))
        .order_by(Client.created_at.desc())
    ).all()
    return [
        {
            "id": c.id,
            "tenantId": c.tenant_id,
            "name": c.name,
            "organization": c.organization,
            "industry": c.industry,
            "region": c.region,
            "onboardingStatus": c.onboarding_status,
            "planName": c.plan.name if c.plan else None,
            "dealValue": c.deal_value,
            "portalEnabled": c.portal_enabled,
            "activeProducts": [p.product_slug for p in c.products if p.provisioned],
            "totalProducts": len(c.products),
            "createdAt": c.created_at.isoformat() if c.created_at else None,
        }
        for c in clients
    ]


@router.get("/tenants/{tenant_id}/config")
def get_tenant_config(tenant_id: str, db: Session = Depends(get_db)) -> dict:
    config = db.scalar(select(TenantConfig).where(TenantConfig.tenant_id == tenant_id))
    if not config:
        raise HTTPException(status_code=404, detail="Tenant config not found — run /deploy/tenant first")
    return {
        "tenantId": config.tenant_id,
        "config": json.loads(config.config or "{}"),
        "storageBucket": config.storage_bucket,
        "dbSchema": config.db_schema,
        "provisionedAt": config.provisioned_at.isoformat() if config.provisioned_at else None,
        "provisionedBy": config.provisioned_by,
        "createdAt": config.created_at.isoformat() if config.created_at else None,
    }


# ── Deployment Control ─────────────────────────────────────────────────────────

class DeployTenantPayload(BaseModel):
    tenant_id: str
    client_name: str
    products: list[str]
    plan: str = "Basic"
    region: str = "us-east-1"


class DeployProductPayload(BaseModel):
    tenant_id: str
    product_slug: str
    enabled_modules: list[str] = []


@router.post("/deploy/tenant", status_code=202)
def deploy_tenant(payload: DeployTenantPayload, db: Session = Depends(get_db)) -> dict:
    """Provision a tenant environment and trigger DeploymentAgent.

    The client must already exist in the CRM (create via POST /crm/clients).
    DeploymentAgent runs async via Celery; falls back to sync in dev.
    """
    client = db.scalar(select(Client).where(Client.tenant_id == payload.tenant_id))
    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found — create via POST /api/v1/crm/clients first",
        )

    agent_payload = payload.model_dump()

    try:
        from app.ai_agents.tasks import run_deployment_agent
        task = run_deployment_agent.delay(agent_payload)
        return {"status": "deploying", "mode": "async", "task_id": task.id, "tenant_id": payload.tenant_id}
    except Exception:
        from app.ai_agents.deployment_agent import DeploymentAgent
        result = DeploymentAgent().run(agent_payload)
        return {"status": "deployed", "mode": "sync", "result": result, "tenant_id": payload.tenant_id}


@router.post("/deploy/product", status_code=202)
def deploy_product(payload: DeployProductPayload, db: Session = Depends(get_db)) -> dict:
    """Activate (or re-provision) a product for an existing tenant."""
    client = db.scalar(select(Client).where(Client.tenant_id == payload.tenant_id))
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    from app.crm.router import PRODUCT_MODULES
    modules = payload.enabled_modules or PRODUCT_MODULES.get(payload.product_slug, [])

    existing = db.scalar(
        select(ClientProduct)
        .where(ClientProduct.client_id == client.id)
        .where(ClientProduct.product_slug == payload.product_slug)
    )
    if existing:
        existing.provisioned = True
        existing.enabled_modules = json.dumps(modules)
    else:
        db.add(ClientProduct(
            client_id=client.id,
            product_slug=payload.product_slug,
            provisioned=True,
            enabled_modules=json.dumps(modules),
        ))

    db.commit()
    publish(PRODUCT_ACTIVATED, {"tenant_id": payload.tenant_id, "product": payload.product_slug})

    return {
        "status": "activated",
        "tenant_id": payload.tenant_id,
        "product": payload.product_slug,
        "modules": modules,
    }


# ── System Event Log ───────────────────────────────────────────────────────────

@router.get("/events")
def list_events(
    event_name: str | None = None,
    tenant_id: str | None = None,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(SystemEvent).order_by(SystemEvent.created_at.desc()).limit(limit)
    if event_name:
        q = q.where(SystemEvent.event_name == event_name)
    if tenant_id:
        q = q.where(SystemEvent.tenant_id == tenant_id)
    return [
        {
            "id": e.id,
            "eventName": e.event_name,
            "payload": json.loads(e.payload or "{}"),
            "processed": e.processed,
            "tenantId": e.tenant_id,
            "createdAt": e.created_at.isoformat() if e.created_at else None,
        }
        for e in db.scalars(q).all()
    ]
