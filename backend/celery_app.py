"""Celery application — configured via the same Settings object as FastAPI."""

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "gridsphere",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.ai_agents.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "app.ai_agents.tasks.run_sales_agent":      {"queue": "agents"},
        "app.ai_agents.tasks.run_deployment_agent": {"queue": "agents"},
        "app.ai_agents.tasks.run_support_agent":    {"queue": "agents"},
    },
)
