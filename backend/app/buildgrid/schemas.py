from pydantic import BaseModel

from app.db.models import BGBOQItem, BGExpense, BGProject, BGPurchaseOrder, BGVendor


# ── Project ────────────────────────────────────────────────────────────────────

class BGProjectRead(BaseModel):
    id: int
    tenant_id: str
    client_id: int | None
    client_name: str | None
    name: str
    location: str
    status: str
    start_date: str
    end_date: str | None
    total_budget: float
    spent_to_date: float
    completion_pct: int
    active_orders: int
    boq_count: int
    created_at: str

    @classmethod
    def from_orm(cls, p: BGProject) -> "BGProjectRead":
        active_orders = sum(
            1 for po in p.purchase_orders if po.status in ("draft", "sent", "approved")
        )
        client_name = p.client.name if p.client else None
        return cls(
            id=p.id,
            tenant_id=p.tenant_id,
            client_id=p.client_id,
            client_name=client_name,
            name=p.name,
            location=p.location,
            status=p.status,
            start_date=p.start_date,
            end_date=p.end_date,
            total_budget=p.total_budget,
            spent_to_date=p.spent_to_date,
            completion_pct=p.completion_pct,
            active_orders=active_orders,
            boq_count=len(p.boq_items),
            created_at=p.created_at.isoformat(),
        )


class BGProjectCreate(BaseModel):
    tenant_id: str
    client_id: int | None = None
    name: str
    location: str = ""
    status: str = "planning"
    start_date: str = ""
    end_date: str | None = None
    total_budget: float = 0


class BGProjectUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    status: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    total_budget: float | None = None
    spent_to_date: float | None = None
    completion_pct: int | None = None


# ── BOQ Item ───────────────────────────────────────────────────────────────────

class BGBOQItemRead(BaseModel):
    id: int
    project_id: int
    item_name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float
    category: str
    notes: str

    @classmethod
    def from_orm(cls, item: BGBOQItem) -> "BGBOQItemRead":
        return cls(
            id=item.id,
            project_id=item.project_id,
            item_name=item.item_name,
            unit=item.unit,
            quantity=item.quantity,
            unit_cost=item.unit_cost,
            total_cost=item.total_cost,
            category=item.category,
            notes=item.notes,
        )


class BGBOQItemCreate(BaseModel):
    project_id: int
    item_name: str
    unit: str = "unit"
    quantity: float = 0
    unit_cost: float = 0
    category: str = ""
    notes: str = ""


# ── Vendor ─────────────────────────────────────────────────────────────────────

class BGVendorRead(BaseModel):
    id: int
    tenant_id: str
    name: str
    contact: str
    email: str
    category: str
    rating: float

    @classmethod
    def from_orm(cls, v: BGVendor) -> "BGVendorRead":
        return cls(
            id=v.id,
            tenant_id=v.tenant_id,
            name=v.name,
            contact=v.contact,
            email=v.email,
            category=v.category,
            rating=v.rating,
        )


class BGVendorCreate(BaseModel):
    tenant_id: str
    name: str
    contact: str = ""
    email: str = ""
    category: str = ""
    rating: float = 0


# ── Purchase Order ─────────────────────────────────────────────────────────────

class BGPurchaseOrderRead(BaseModel):
    id: int
    project_id: int
    project_name: str | None
    vendor_id: int
    vendor_name: str | None
    amount: float
    status: str
    description: str
    created_at: str

    @classmethod
    def from_orm(cls, po: BGPurchaseOrder) -> "BGPurchaseOrderRead":
        return cls(
            id=po.id,
            project_id=po.project_id,
            project_name=po.project.name if po.project else None,
            vendor_id=po.vendor_id,
            vendor_name=po.vendor.name if po.vendor else None,
            amount=po.amount,
            status=po.status,
            description=po.description,
            created_at=po.created_at.isoformat(),
        )


class BGPurchaseOrderCreate(BaseModel):
    project_id: int
    vendor_id: int
    amount: float = 0
    status: str = "draft"
    description: str = ""


class BGPurchaseOrderStatusUpdate(BaseModel):
    status: str


# ── Expense ────────────────────────────────────────────────────────────────────

class BGExpenseRead(BaseModel):
    id: int
    project_id: int
    amount: float
    category: str
    description: str
    date: str

    @classmethod
    def from_orm(cls, e: BGExpense) -> "BGExpenseRead":
        return cls(
            id=e.id,
            project_id=e.project_id,
            amount=e.amount,
            category=e.category,
            description=e.description,
            date=e.date,
        )


class BGExpenseCreate(BaseModel):
    project_id: int
    amount: float
    category: str
    description: str = ""
    date: str = ""
