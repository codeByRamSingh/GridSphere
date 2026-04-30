from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Agent
from app.db.session import get_db

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("")
def list_agents(db: Session = Depends(get_db)) -> dict:
    agents = db.scalars(select(Agent).order_by(Agent.id)).all()
    return {
        "agents": [
            {
                "id": f"agent_{agent.id}",
                "name": agent.name,
                "role": agent.role,
                "currentTask": agent.current_task,
                "status": agent.status,
                "tokenCost": agent.token_cost,
                "completedTasks": agent.completed_tasks,
                "efficiency": agent.efficiency,
            }
            for agent in agents
        ],
        "logs": [
            {
                "id": "log_engineer_tests",
                "agent": "AI Engineer",
                "event": "Generated regression test matrix for CampusGrid billing workflows.",
                "time": "5 min ago",
                "severity": "success",
            },
            {
                "id": "log_cto_gpu",
                "agent": "AI CTO",
                "event": "Raised warning on GPU queue saturation during nightly model evaluation.",
                "time": "17 min ago",
                "severity": "warning",
            },
        ],
    }
