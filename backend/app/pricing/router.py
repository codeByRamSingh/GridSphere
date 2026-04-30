from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Plan
from app.db.session import get_db
from app.pricing.schemas import PlanRead

router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.get("/plans")
def list_plans(db: Session = Depends(get_db)) -> list[dict]:
    plans = db.scalars(select(Plan).order_by(Plan.id)).all()
    return [PlanRead.from_orm(p).model_dump() for p in plans]
