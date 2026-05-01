"""Celery tasks — one per agent type.

Each task:
  1. Runs the agent synchronously inside the worker
  2. Persists the AgentRun record to the DB
  3. Publishes completion/failure events on the event bus

Workers start with:
    celery -A celery_app worker -Q agents --loglevel=info
"""

import json
import logging

from celery_app import celery_app
from app.core.events import AGENT_RUN_COMPLETED, DEPLOYMENT_COMPLETED, publish

logger = logging.getLogger("gridsphere.tasks")


def _persist_run(
    agent_type: str,
    trigger: str,
    input_payload: dict,
    result: dict,
    tenant_id: str | None,
) -> None:
    try:
        from app.db.models import AgentRun
        from app.db.session import SessionLocal
        db = SessionLocal()
        db.add(AgentRun(
            agent_type=agent_type,
            trigger_event=trigger,
            status=result.get("status", "unknown"),
            input_payload=json.dumps(input_payload),
            output_payload=json.dumps(result.get("output", {})),
            decision_log=json.dumps(result.get("decision_log", [])),
            duration_ms=result.get("duration_ms"),
            error=result.get("error"),
            tenant_id=tenant_id,
        ))
        db.commit()
        db.close()
    except Exception as exc:
        logger.warning("AgentRun persistence failed: %s", exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def run_sales_agent(self, input_payload: dict) -> dict:
    from app.ai_agents.sales_agent import SalesAgent
    try:
        result = SalesAgent().run(input_payload)
    except Exception as exc:
        raise self.retry(exc=exc)
    tenant_id = input_payload.get("tenant_id")
    _persist_run("SalesAgent", "LEAD_CREATED", input_payload, result, tenant_id)
    publish(AGENT_RUN_COMPLETED, {"agent": "SalesAgent", "status": result["status"], "tenant_id": tenant_id})
    return result


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def run_deployment_agent(self, input_payload: dict) -> dict:
    from app.ai_agents.deployment_agent import DeploymentAgent
    try:
        result = DeploymentAgent().run(input_payload)
    except Exception as exc:
        raise self.retry(exc=exc)
    tenant_id = input_payload.get("tenant_id")
    _persist_run("DeploymentAgent", "TENANT_CREATED", input_payload, result, tenant_id)
    if result.get("status") == "completed":
        publish(DEPLOYMENT_COMPLETED, {
            "tenant_id": tenant_id,
            "steps_completed": result.get("output", {}).get("steps_completed", 0),
        })
    publish(AGENT_RUN_COMPLETED, {"agent": "DeploymentAgent", "status": result["status"], "tenant_id": tenant_id})
    return result


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def run_support_agent(self, input_payload: dict) -> dict:
    from app.ai_agents.support_agent import SupportAgent
    try:
        result = SupportAgent().run(input_payload)
    except Exception as exc:
        raise self.retry(exc=exc)
    tenant_id = input_payload.get("tenant_id")
    _persist_run("SupportAgent", "ACTIVITY_ANALYZED", input_payload, result, tenant_id)
    publish(AGENT_RUN_COMPLETED, {"agent": "SupportAgent", "status": result["status"], "tenant_id": tenant_id})
    return result
