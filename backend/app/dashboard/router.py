from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Agent, Customer, Expense, Product, Revenue, Task
from app.db.session import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/executive")
def executive_dashboard(db: Session = Depends(get_db)) -> dict:
    products = db.scalars(select(Product).order_by(Product.id)).all()
    total_mrr = sum(product.revenue_monthly for product in products)
    customer_count = db.scalar(select(func.sum(Customer.seats))) or 0
    agent_count = db.scalar(select(func.count(Agent.id))) or 0
    critical_tasks = db.scalar(
        select(func.count(Task.id)).where(Task.priority == "Critical", Task.status != "Done")
    ) or 0
    infra_health = round(sum(product.health for product in products) / max(len(products), 1))

    revenue_by_month = []
    for month in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]:
        revenue = db.scalar(select(func.sum(Revenue.amount)).where(Revenue.month == month)) or 0
        expenses = db.scalar(select(func.sum(Expense.amount)).where(Expense.month == month)) or 0
        revenue_by_month.append(
            {
                "name": month,
                "revenue": float(revenue),
                "expenses": float(expenses),
                "customers": int(customer_count * (0.58 + len(revenue_by_month) * 0.085)),
            }
        )

    product_growth = []
    product_lookup = {product.slug: product for product in products}
    for month in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]:
        product_growth.append(
            {
                "name": month,
                "buildGrid": _revenue_for(product_lookup.get("buildgrid"), month, db),
                "campusGrid": _revenue_for(product_lookup.get("campusgrid"), month, db),
                "farmGrid": _revenue_for(product_lookup.get("farmgrid"), month, db),
            }
        )

    return {
        "kpis": [
            {"label": "Total MRR", "value": f"${round(total_mrr / 1000)}K", "delta": "+17.6% vs last month", "tone": "cyan"},
            {"label": "Active Customers", "value": f"{customer_count:,}", "delta": "+214 net new", "tone": "green"},
            {"label": "Active Products", "value": str(len(products)), "delta": "2 in build pipeline", "tone": "violet"},
            {"label": "Active AI Agents", "value": str(agent_count), "delta": "91% avg efficiency", "tone": "slate"},
            {"label": "Infrastructure Health", "value": f"{infra_health}%", "delta": "All critical systems live", "tone": "green"},
            {"label": "Open Critical Tasks", "value": str(critical_tasks), "delta": "3 require human review", "tone": "amber"},
        ],
        "revenueGrowth": revenue_by_month,
        "productGrowth": product_growth,
        "monthlyExpenses": [{"name": row["name"], "expenses": row["expenses"]} for row in revenue_by_month],
        "activities": [
            {
                "id": "act_backend_deploy",
                "title": "BuildGrid production deploy completed",
                "description": "v2.8.4 shipped procurement approvals and site issue triage.",
                "time": "8 min ago",
                "type": "deployment",
            },
            {
                "id": "act_backend_agent",
                "title": "AI Product Manager closed discovery batch",
                "description": "Synthesized research into roadmap opportunities.",
                "time": "24 min ago",
                "type": "agent",
            },
        ],
        "quickActions": ["Launch New Product", "Assign AI Task", "Deploy Product", "Generate Report"],
    }


def _revenue_for(product: Product | None, month: str, db: Session) -> float:
    if not product:
        return 0
    return float(
        db.scalar(select(func.sum(Revenue.amount)).where(Revenue.product_id == product.id, Revenue.month == month))
        or 0
    )
