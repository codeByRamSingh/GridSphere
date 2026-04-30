from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Customer, Product
from app.db.session import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("")
def analytics_dashboard(db: Session = Depends(get_db)) -> dict:
    customer_count = db.scalar(select(func.sum(Customer.seats))) or 0
    products = db.scalars(select(Product).order_by(Product.id)).all()
    geography_rows = db.execute(select(Customer.region, func.count(Customer.id)).group_by(Customer.region)).all()

    return {
        "acquisition": [
            {"name": "Jan", "customers": int(customer_count * 0.50)},
            {"name": "Feb", "customers": int(customer_count * 0.58)},
            {"name": "Mar", "customers": int(customer_count * 0.66)},
            {"name": "Apr", "customers": int(customer_count * 0.77)},
            {"name": "May", "customers": int(customer_count * 0.91)},
            {"name": "Jun", "customers": int(customer_count)},
        ],
        "churn": [
            {"name": "Jan", "value": 4.8},
            {"name": "Feb", "value": 4.2},
            {"name": "Mar", "value": 3.9},
            {"name": "Apr", "value": 3.4},
            {"name": "May", "value": 3.1},
            {"name": "Jun", "value": 2.8},
        ],
        "funnel": [
            {"name": "Visitors", "value": 48000},
            {"name": "Trials", "value": 8200},
            {"name": "Activated", "value": 3140},
            {"name": "Paid", "value": 642},
        ],
        "geography": [
            {"name": region, "value": round(count / max(customer_count, 1) * 100, 1)}
            for region, count in geography_rows
        ],
        "adoption": [{"name": product.name, "value": product.health} for product in products],
    }
