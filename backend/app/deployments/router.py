from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Deployment
from app.db.session import get_db

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.get("")
def list_deployments(db: Session = Depends(get_db)) -> list[dict]:
    deployments = db.scalars(select(Deployment).order_by(Deployment.id.desc())).all()
    return [
        {
            "id": deployment.id,
            "serviceName": deployment.service_name,
            "version": deployment.version,
            "environment": deployment.environment,
            "status": deployment.status,
            "notes": deployment.notes,
            "productId": deployment.product_id,
        }
        for deployment in deployments
    ]
