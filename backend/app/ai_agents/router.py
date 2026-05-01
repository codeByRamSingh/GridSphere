"""AI agent dispatch and run history endpoints.

POST /api/v1/ai-agents/dispatch/sales       → queue or run SalesAgent
POST /api/v1/ai-agents/dispatch/deployment  → queue or run DeploymentAgent
POST /api/v1/ai-agents/dispatch/support     → queue or run SupportAgent
GET  /api/v1/ai-agents/runs                 → list agent run history
GET  /api/v1/ai-agents/runs/{run_id}        → full run detail + decision log
"""

import json

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import AgentRun
from app.db.session import get_db

router = APIRouter(prefix="/ai-agents", tags=["ai-agents"])


# ── Request schemas ─────────────────────────────────────────────────────────────

class LeadPayload(BaseModel):
    name: str
    email: EmailStr
    company: str
    industry: str
    company_size: str = "sme"
    product_interest: list[str] = []
    tenant_id: str | None = None


class DeployPayload(BaseModel):
    tenant_id: str
    client_name: str
    products: list[str]
    plan: str = "Basic"
    region: str = "us-east-1"


class SupportPayload(BaseModel):
    tenant_id: str
    logs: list[dict] = []
    activity: list[dict] = []


# ── Celery-or-sync dispatch helper ─────────────────────────────────────────────

def _celery_dispatch(task_fn, payload_dict: dict) -> dict:
    """Try Celery; fall back to synchronous execution if broker unavailable."""
    try:
        task = task_fn.delay(payload_dict)
        return {"queued": True, "task_id": task.id}
    except Exception:
        # Redis unavailable — run inline (dev / test environments)
        result = task_fn.__wrapped__(None, payload_dict) if hasattr(task_fn, "__wrapped__") else None
        return {"queued": False, "result": result}


# ── Dispatch endpoints ─────────────────────────────────────────────────────────

@router.post("/dispatch/sales")
def dispatch_sales_agent(payload: LeadPayload) -> dict:
    from app.ai_agents.sales_agent import SalesAgent
    try:
        from app.ai_agents.tasks import run_sales_agent
        task = run_sales_agent.delay(payload.model_dump())
        return {"queued": True, "task_id": task.id, "agent": "SalesAgent"}
    except Exception:
        result = SalesAgent().run(payload.model_dump())
        return {"queued": False, "result": result, "agent": "SalesAgent"}


@router.post("/dispatch/deployment")
def dispatch_deployment_agent(payload: DeployPayload) -> dict:
    from app.ai_agents.deployment_agent import DeploymentAgent
    try:
        from app.ai_agents.tasks import run_deployment_agent
        task = run_deployment_agent.delay(payload.model_dump())
        return {"queued": True, "task_id": task.id, "agent": "DeploymentAgent"}
    except Exception:
        result = DeploymentAgent().run(payload.model_dump())
        return {"queued": False, "result": result, "agent": "DeploymentAgent"}


@router.post("/dispatch/support")
def dispatch_support_agent(payload: SupportPayload) -> dict:
    from app.ai_agents.support_agent import SupportAgent
    try:
        from app.ai_agents.tasks import run_support_agent
        task = run_support_agent.delay(payload.model_dump())
        return {"queued": True, "task_id": task.id, "agent": "SupportAgent"}
    except Exception:
        result = SupportAgent().run(payload.model_dump())
        return {"queued": False, "result": result, "agent": "SupportAgent"}


# ── Run history ────────────────────────────────────────────────────────────────

@router.get("/runs")
def list_agent_runs(
    agent_type: str | None = Query(None),
    tenant_id: str | None = Query(None),
    status: str | None = Query(None),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(AgentRun).order_by(AgentRun.created_at.desc()).limit(limit)
    if agent_type:
        q = q.where(AgentRun.agent_type == agent_type)
    if tenant_id:
        q = q.where(AgentRun.tenant_id == tenant_id)
    if status:
        q = q.where(AgentRun.status == status)
    return [
        {
            "id": r.id,
            "agentType": r.agent_type,
            "triggerEvent": r.trigger_event,
            "status": r.status,
            "tenantId": r.tenant_id,
            "durationMs": r.duration_ms,
            "createdAt": r.created_at.isoformat() if r.created_at else None,
        }
        for r in db.scalars(q).all()
    ]


@router.get("/runs/{run_id}")
def get_agent_run(run_id: int, db: Session = Depends(get_db)) -> dict:
    run = db.get(AgentRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Agent run not found")
    return {
        "id": run.id,
        "agentType": run.agent_type,
        "triggerEvent": run.trigger_event,
        "status": run.status,
        "inputPayload": json.loads(run.input_payload or "{}"),
        "outputPayload": json.loads(run.output_payload or "{}"),
        "decisionLog": json.loads(run.decision_log or "[]"),
        "durationMs": run.duration_ms,
        "error": run.error,
        "tenantId": run.tenant_id,
        "createdAt": run.created_at.isoformat() if run.created_at else None,
        "updatedAt": run.updated_at.isoformat() if run.updated_at else None,
    }
