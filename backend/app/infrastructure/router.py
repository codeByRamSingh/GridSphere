from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Deployment, InfrastructureMetric
from app.db.session import get_db

router = APIRouter(prefix="/infrastructure", tags=["infrastructure"])


@router.get("")
def infrastructure_dashboard(db: Session = Depends(get_db)) -> dict:
    metrics = db.scalars(select(InfrastructureMetric).order_by(InfrastructureMetric.id)).all()
    deployments = db.scalars(select(Deployment).order_by(Deployment.id.desc()).limit(5)).all()

    return {
        "metrics": [
            {
                "label": metric.label,
                "value": metric.value,
                "progress": metric.progress,
                "status": metric.status,
            }
            for metric in metrics
        ],
        "clusterHealth": [
            {"name": "00:00", "value": 96},
            {"name": "04:00", "value": 95},
            {"name": "08:00", "value": 97},
            {"name": "12:00", "value": 93},
            {"name": "16:00", "value": 94},
            {"name": "20:00", "value": 96},
        ],
        "deploymentLogs": [
            f"{deployment.service_name} {deployment.status} to {deployment.environment}"
            for deployment in deployments
        ],
    }
