from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Product, Revenue
from app.db.session import get_db

router = APIRouter(prefix="/products", tags=["products"])


def serialize_product(product: Product, db: Session) -> dict:
    revenue_rows = db.scalars(
        select(Revenue).where(Revenue.product_id == product.id).order_by(Revenue.id)
    ).all()
    adoption = [
        {"name": "Core", "value": product.health},
        {"name": "Finance", "value": max(product.health - 16, 20)},
        {"name": "Automation", "value": max(product.health - 22, 20)},
        {"name": "Reports", "value": max(product.health - 28, 20)},
    ]

    return {
        "id": f"prod_{product.slug}",
        "slug": product.slug,
        "name": product.name,
        "description": product.description,
        "market": product.market,
        "stage": product.stage,
        "revenue": product.revenue_monthly,
        "activeUsers": product.active_users,
        "growth": product.growth_rate,
        "openBugs": product.open_bugs,
        "deploymentStatus": product.deployment_status,
        "health": product.health,
        "owner": product.owner,
        "nextMilestone": product.next_milestone,
        "mrrSeries": [{"name": row.month, "revenue": row.amount} for row in revenue_rows],
        "adoption": adoption,
    }


@router.get("")
def list_products(db: Session = Depends(get_db)) -> list[dict]:
    products = db.scalars(select(Product).order_by(Product.id)).all()
    return [serialize_product(product, db) for product in products]


@router.get("/{slug}")
def get_product(slug: str, db: Session = Depends(get_db)) -> dict:
    product = db.scalar(select(Product).where(Product.slug == slug))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_product(product, db)
