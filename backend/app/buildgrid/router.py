from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.buildgrid.schemas import (
    BGBOQItemCreate,
    BGBOQItemRead,
    BGExpenseCreate,
    BGExpenseRead,
    BGProjectCreate,
    BGProjectRead,
    BGProjectUpdate,
    BGPurchaseOrderCreate,
    BGPurchaseOrderRead,
    BGPurchaseOrderStatusUpdate,
    BGVendorCreate,
    BGVendorRead,
)
from app.db.models import BGBOQItem, BGExpense, BGProject, BGPurchaseOrder, BGVendor
from app.db.session import get_db

router = APIRouter(prefix="/buildgrid", tags=["buildgrid"])

VALID_PROJECT_STATUSES = {"planning", "active", "completed", "on_hold"}
VALID_PO_STATUSES = {"draft", "sent", "approved", "fulfilled", "cancelled"}


def _load_project(project_id: int, db: Session) -> BGProject:
    project = db.scalar(
        select(BGProject)
        .where(BGProject.id == project_id)
        .options(
            selectinload(BGProject.boq_items),
            selectinload(BGProject.purchase_orders).selectinload(BGPurchaseOrder.vendor),
            selectinload(BGProject.expenses),
            selectinload(BGProject.client),
        )
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ── Projects ───────────────────────────────────────────────────────────────────

@router.get("/projects")
def list_projects(
    tenant_id: str | None = Query(None),
    status: str | None = Query(None),
    client_id: int | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(BGProject).options(
        selectinload(BGProject.boq_items),
        selectinload(BGProject.purchase_orders).selectinload(BGPurchaseOrder.vendor),
        selectinload(BGProject.expenses),
        selectinload(BGProject.client),
    )
    if tenant_id:
        q = q.where(BGProject.tenant_id == tenant_id)
    if status:
        q = q.where(BGProject.status == status)
    if client_id:
        q = q.where(BGProject.client_id == client_id)
    q = q.order_by(BGProject.created_at.desc())
    return [BGProjectRead.from_orm(p).model_dump() for p in db.scalars(q).all()]


@router.post("/projects", status_code=201)
def create_project(payload: BGProjectCreate, db: Session = Depends(get_db)) -> dict:
    if payload.status not in VALID_PROJECT_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status: {payload.status}")
    project = BGProject(
        tenant_id=payload.tenant_id,
        client_id=payload.client_id,
        name=payload.name,
        location=payload.location,
        status=payload.status,
        start_date=payload.start_date,
        end_date=payload.end_date,
        total_budget=payload.total_budget,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return BGProjectRead.from_orm(_load_project(project.id, db)).model_dump()


@router.get("/projects/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)) -> dict:
    return BGProjectRead.from_orm(_load_project(project_id, db)).model_dump()


@router.patch("/projects/{project_id}")
def update_project(
    project_id: int, payload: BGProjectUpdate, db: Session = Depends(get_db)
) -> dict:
    project = _load_project(project_id, db)
    if payload.status and payload.status not in VALID_PROJECT_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status: {payload.status}")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return BGProjectRead.from_orm(_load_project(project_id, db)).model_dump()


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    project = _load_project(project_id, db)
    db.delete(project)
    db.commit()


# ── BOQ Items ──────────────────────────────────────────────────────────────────

@router.get("/boq")
def list_boq_items(
    project_id: int | None = Query(None),
    category: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(BGBOQItem)
    if project_id:
        q = q.where(BGBOQItem.project_id == project_id)
    if category:
        q = q.where(BGBOQItem.category == category)
    q = q.order_by(BGBOQItem.category, BGBOQItem.id)
    return [BGBOQItemRead.from_orm(i).model_dump() for i in db.scalars(q).all()]


@router.post("/boq", status_code=201)
def create_boq_item(payload: BGBOQItemCreate, db: Session = Depends(get_db)) -> dict:
    # Verify project exists
    db.get(BGProject, payload.project_id) or (_ for _ in ()).throw(
        HTTPException(status_code=404, detail="Project not found")
    )
    total = round(payload.quantity * payload.unit_cost, 2)
    item = BGBOQItem(
        project_id=payload.project_id,
        item_name=payload.item_name,
        unit=payload.unit,
        quantity=payload.quantity,
        unit_cost=payload.unit_cost,
        total_cost=total,
        category=payload.category,
        notes=payload.notes,
    )
    db.add(item)
    # Recalculate project spent_to_date from BOQ totals
    project = db.get(BGProject, payload.project_id)
    if project:
        db.flush()
        existing_total = db.scalar(
            select(BGBOQItem.total_cost).where(BGBOQItem.project_id == project.id)
        )
        project.spent_to_date = sum(
            i.total_cost
            for i in db.scalars(select(BGBOQItem).where(BGBOQItem.project_id == project.id)).all()
        )
    db.commit()
    db.refresh(item)
    return BGBOQItemRead.from_orm(item).model_dump()


@router.delete("/boq/{item_id}", status_code=204)
def delete_boq_item(item_id: int, db: Session = Depends(get_db)) -> None:
    item = db.get(BGBOQItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="BOQ item not found")
    db.delete(item)
    db.commit()


# ── Vendors ────────────────────────────────────────────────────────────────────

@router.get("/vendors")
def list_vendors(
    tenant_id: str | None = Query(None),
    category: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(BGVendor)
    if tenant_id:
        q = q.where(BGVendor.tenant_id == tenant_id)
    if category:
        q = q.where(BGVendor.category == category)
    q = q.order_by(BGVendor.name)
    return [BGVendorRead.from_orm(v).model_dump() for v in db.scalars(q).all()]


@router.post("/vendors", status_code=201)
def create_vendor(payload: BGVendorCreate, db: Session = Depends(get_db)) -> dict:
    vendor = BGVendor(
        tenant_id=payload.tenant_id,
        name=payload.name,
        contact=payload.contact,
        email=payload.email,
        category=payload.category,
        rating=payload.rating,
    )
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return BGVendorRead.from_orm(vendor).model_dump()


# ── Purchase Orders ────────────────────────────────────────────────────────────

@router.get("/purchase-orders")
def list_purchase_orders(
    project_id: int | None = Query(None),
    tenant_id: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = (
        select(BGPurchaseOrder)
        .options(
            selectinload(BGPurchaseOrder.vendor),
            selectinload(BGPurchaseOrder.project),
        )
    )
    if project_id:
        q = q.where(BGPurchaseOrder.project_id == project_id)
    if status:
        q = q.where(BGPurchaseOrder.status == status)
    if tenant_id:
        q = q.join(BGProject).where(BGProject.tenant_id == tenant_id)
    q = q.order_by(BGPurchaseOrder.created_at.desc())
    return [BGPurchaseOrderRead.from_orm(po).model_dump() for po in db.scalars(q).all()]


@router.post("/purchase-orders", status_code=201)
def create_purchase_order(
    payload: BGPurchaseOrderCreate, db: Session = Depends(get_db)
) -> dict:
    if payload.status not in VALID_PO_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status: {payload.status}")
    if not db.get(BGProject, payload.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    if not db.get(BGVendor, payload.vendor_id):
        raise HTTPException(status_code=404, detail="Vendor not found")
    po = BGPurchaseOrder(
        project_id=payload.project_id,
        vendor_id=payload.vendor_id,
        amount=payload.amount,
        status=payload.status,
        description=payload.description,
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    po = db.scalar(
        select(BGPurchaseOrder)
        .where(BGPurchaseOrder.id == po.id)
        .options(selectinload(BGPurchaseOrder.vendor), selectinload(BGPurchaseOrder.project))
    )
    return BGPurchaseOrderRead.from_orm(po).model_dump()


@router.patch("/purchase-orders/{po_id}/status")
def update_po_status(
    po_id: int, payload: BGPurchaseOrderStatusUpdate, db: Session = Depends(get_db)
) -> dict:
    if payload.status not in VALID_PO_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status: {payload.status}")
    po = db.scalar(
        select(BGPurchaseOrder)
        .where(BGPurchaseOrder.id == po_id)
        .options(selectinload(BGPurchaseOrder.vendor), selectinload(BGPurchaseOrder.project))
    )
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    po.status = payload.status
    db.commit()
    db.refresh(po)
    return BGPurchaseOrderRead.from_orm(po).model_dump()


# ── Expenses ───────────────────────────────────────────────────────────────────

@router.get("/expenses")
def list_expenses(
    project_id: int | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict]:
    q = select(BGExpense)
    if project_id:
        q = q.where(BGExpense.project_id == project_id)
    q = q.order_by(BGExpense.date.desc())
    return [BGExpenseRead.from_orm(e).model_dump() for e in db.scalars(q).all()]


@router.post("/expenses", status_code=201)
def create_expense(payload: BGExpenseCreate, db: Session = Depends(get_db)) -> dict:
    if not db.get(BGProject, payload.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    expense = BGExpense(
        project_id=payload.project_id,
        amount=payload.amount,
        category=payload.category,
        description=payload.description,
        date=payload.date,
    )
    db.add(expense)
    # Keep spent_to_date in sync
    project = db.get(BGProject, payload.project_id)
    if project:
        project.spent_to_date = (project.spent_to_date or 0) + payload.amount
    db.commit()
    db.refresh(expense)
    return BGExpenseRead.from_orm(expense).model_dump()
