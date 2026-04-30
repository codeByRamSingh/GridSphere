from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Customer
from app.db.session import get_db

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("")
def list_customers(db: Session = Depends(get_db)) -> list[dict]:
    customers = db.scalars(select(Customer).order_by(Customer.id)).all()
    return [
        {
            "id": customer.id,
            "name": customer.name,
            "segment": customer.segment,
            "seats": customer.seats,
            "mrr": customer.mrr,
            "region": customer.region,
            "status": customer.status,
            "productId": customer.product_id,
        }
        for customer in customers
    ]
