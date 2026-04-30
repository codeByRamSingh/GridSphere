from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Expense, Product, Revenue
from app.db.session import get_db

router = APIRouter(prefix="/finance", tags=["finance"])


@router.get("")
def finance_dashboard(db: Session = Depends(get_db)) -> dict:
    finance_series = []
    for month in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]:
        finance_series.append(
            {
                "name": month,
                "revenue": float(db.scalar(select(func.sum(Revenue.amount)).where(Revenue.month == month)) or 0),
                "expenses": float(db.scalar(select(func.sum(Expense.amount)).where(Expense.month == month)) or 0),
            }
        )

    expenses_by_category = db.execute(
        select(Expense.category, func.sum(Expense.amount)).group_by(Expense.category)
    ).all()
    total_expenses = sum(float(amount) for _, amount in expenses_by_category) or 1

    products = db.scalars(select(Product).order_by(Product.id)).all()
    profitability = []
    for product in products:
        product_expenses = db.scalar(
            select(func.sum(Expense.amount)).where(Expense.product_id == product.id)
        ) or 0
        profitability.append(
            {
                "name": product.name,
                "revenue": product.revenue_monthly,
                "expenses": float(product_expenses),
            }
        )

    return {
        "financeSeries": finance_series,
        "expensesBreakdown": [
            {"name": category, "value": round(float(amount) / total_expenses * 100, 1)}
            for category, amount in expenses_by_category
        ],
        "profitability": profitability,
    }
