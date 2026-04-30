import json
import re

from pydantic import BaseModel, EmailStr, field_validator

from app.db.models import Client, ClientProduct, ClientUser


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


class ClientProductRead(BaseModel):
    id: int
    product_slug: str
    provisioned: bool
    enabled_modules: list[str]

    @classmethod
    def from_orm(cls, cp: ClientProduct) -> "ClientProductRead":
        try:
            modules = json.loads(cp.enabled_modules)
        except (json.JSONDecodeError, TypeError):
            modules = []
        return cls(id=cp.id, product_slug=cp.product_slug, provisioned=cp.provisioned, enabled_modules=modules)


class ClientUserRead(BaseModel):
    id: int
    email: str
    role: str
    invited: bool
    accepted: bool

    @classmethod
    def from_orm(cls, cu: ClientUser) -> "ClientUserRead":
        return cls(id=cu.id, email=cu.email, role=cu.role, invited=cu.invited, accepted=cu.accepted)


class ClientRead(BaseModel):
    id: int
    name: str
    organization: str
    contact_person: str
    email: str
    phone: str
    industry: str
    tenant_id: str
    plan_id: int | None
    plan_name: str | None
    region: str
    deal_value: float
    portal_enabled: bool
    onboarding_status: str
    account_manager_id: int | None
    notes: str
    tags: list[str]
    products: list[ClientProductRead]
    users: list[ClientUserRead]
    created_at: str

    @classmethod
    def from_orm(cls, client: Client) -> "ClientRead":
        try:
            tags = [t.strip() for t in client.tags.split(",") if t.strip()] if client.tags else []
        except Exception:
            tags = []
        return cls(
            id=client.id,
            name=client.name,
            organization=client.organization,
            contact_person=client.contact_person,
            email=client.email,
            phone=client.phone,
            industry=client.industry,
            tenant_id=client.tenant_id,
            plan_id=client.plan_id,
            plan_name=client.plan.name if client.plan else None,
            region=client.region,
            deal_value=client.deal_value,
            portal_enabled=client.portal_enabled,
            onboarding_status=client.onboarding_status,
            account_manager_id=client.account_manager_id,
            notes=client.notes,
            tags=tags,
            products=[ClientProductRead.from_orm(p) for p in client.products],
            users=[ClientUserRead.from_orm(u) for u in client.users],
            created_at=client.created_at.isoformat(),
        )


class ClientProductCreate(BaseModel):
    product_slug: str
    enabled_modules: list[str] = []


class ClientUserCreate(BaseModel):
    email: EmailStr
    role: str = "admin"


class ClientCreate(BaseModel):
    name: str
    organization: str
    contact_person: str = ""
    email: EmailStr
    phone: str = ""
    industry: str
    tenant_id: str = ""
    plan_id: int | None = None
    region: str = ""
    deal_value: float = 0
    portal_enabled: bool = False
    account_manager_id: int | None = None
    notes: str = ""
    tags: list[str] = []
    products: list[ClientProductCreate] = []
    users: list[ClientUserCreate] = []

    @field_validator("tenant_id", mode="before")
    @classmethod
    def auto_tenant_id(cls, v: str, info) -> str:
        if v:
            return slugify(v)
        org = (info.data or {}).get("organization", "")
        return slugify(org) if org else v


class ClientStatusUpdate(BaseModel):
    onboarding_status: str
