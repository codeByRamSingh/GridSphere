import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.crm.schemas import ClientCreate, ClientRead, ClientStatusUpdate, slugify
from app.db.models import Client, ClientProduct, ClientUser
from app.db.session import get_db

router = APIRouter(prefix="/crm", tags=["crm"])

VALID_STATUSES = {"draft", "provisioning", "active", "suspended", "churned"}

PRODUCT_MODULES: dict[str, list[str]] = {
    "campusgrid": ["admissions", "academics", "billing", "reports", "communication"],
    "buildgrid": ["projects", "boq", "vendors", "finance", "procurement"],
    "farmgrid": ["crop-plans", "sensors", "inventory", "finance"],
}


def _load_client(client_id: int, db: Session) -> Client:
    client = db.scalar(
        select(Client)
        .where(Client.id == client_id)
        .options(selectinload(Client.products), selectinload(Client.users), selectinload(Client.plan))
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.get("/clients")
def list_clients(db: Session = Depends(get_db)) -> list[dict]:
    clients = db.scalars(
        select(Client)
        .order_by(Client.created_at.desc())
        .options(selectinload(Client.products), selectinload(Client.users), selectinload(Client.plan))
    ).all()
    return [ClientRead.from_orm(c).model_dump() for c in clients]


@router.post("/clients", status_code=201)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)) -> dict:
    existing = db.scalar(select(Client).where(Client.tenant_id == payload.tenant_id))
    if existing:
        raise HTTPException(status_code=409, detail=f"tenant_id '{payload.tenant_id}' already exists")

    client = Client(
        name=payload.name,
        organization=payload.organization,
        contact_person=payload.contact_person,
        email=str(payload.email),
        phone=payload.phone,
        industry=payload.industry,
        tenant_id=payload.tenant_id,
        plan_id=payload.plan_id,
        region=payload.region,
        deal_value=payload.deal_value,
        portal_enabled=payload.portal_enabled,
        onboarding_status="provisioning",
        account_manager_id=payload.account_manager_id,
        notes=payload.notes,
        tags=", ".join(payload.tags),
    )
    db.add(client)
    db.flush()

    for p in payload.products:
        default_modules = PRODUCT_MODULES.get(p.product_slug, [])
        modules = p.enabled_modules if p.enabled_modules else default_modules
        db.add(ClientProduct(
            client_id=client.id,
            product_slug=p.product_slug,
            provisioned=True,
            enabled_modules=json.dumps(modules),
        ))

    for u in payload.users:
        db.add(ClientUser(
            client_id=client.id,
            email=str(u.email),
            role=u.role,
            invited=True,
            accepted=False,
        ))

    client.onboarding_status = "active"
    db.commit()
    db.refresh(client)

    return ClientRead.from_orm(_load_client(client.id, db)).model_dump()


@router.get("/clients/{client_id}")
def get_client(client_id: int, db: Session = Depends(get_db)) -> dict:
    return ClientRead.from_orm(_load_client(client_id, db)).model_dump()


@router.patch("/clients/{client_id}/status")
def update_client_status(client_id: int, payload: ClientStatusUpdate, db: Session = Depends(get_db)) -> dict:
    if payload.onboarding_status not in VALID_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")
    client = _load_client(client_id, db)
    client.onboarding_status = payload.onboarding_status
    db.commit()
    db.refresh(client)
    return ClientRead.from_orm(_load_client(client_id, db)).model_dump()
