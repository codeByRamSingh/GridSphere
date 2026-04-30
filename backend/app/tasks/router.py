from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import ProductIdea, Task
from app.db.session import get_db

router = APIRouter(tags=["tasks"])


@router.get("/tasks")
def list_tasks(db: Session = Depends(get_db)) -> list[dict]:
    tasks = db.scalars(select(Task).order_by(Task.id)).all()
    return [
        {
            "id": task.id,
            "title": task.title,
            "priority": task.priority,
            "status": task.status,
            "dueDate": task.due_date,
            "productId": task.product_id,
            "agentId": task.agent_id,
        }
        for task in tasks
    ]


@router.get("/product-ideas")
def list_product_ideas(db: Session = Depends(get_db)) -> list[dict]:
    ideas = db.scalars(select(ProductIdea).order_by(ProductIdea.id)).all()
    return [
        {
            "id": f"idea_{idea.id}",
            "title": idea.title,
            "stage": idea.stage,
            "marketSize": idea.market_size,
            "estimatedRevenue": idea.estimated_revenue,
            "category": idea.category,
            "priority": idea.priority,
            "assignedTeam": idea.assigned_team,
        }
        for idea in ideas
    ]
