"""In-process event bus with optional Redis pub/sub and DB persistence.

Usage:
    from app.core.events import publish, subscribe, TENANT_CREATED

    publish(TENANT_CREATED, {"tenant_id": "acme"})
    subscribe(TENANT_CREATED, my_handler)
"""

import asyncio
import json
import logging
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Callable

logger = logging.getLogger("gridsphere.events")

# ── Event name constants ────────────────────────────────────────────────────────
LEAD_CREATED = "LEAD_CREATED"
TENANT_CREATED = "TENANT_CREATED"
DEPLOYMENT_COMPLETED = "DEPLOYMENT_COMPLETED"
AGENT_RUN_COMPLETED = "AGENT_RUN_COMPLETED"
PRODUCT_ACTIVATED = "PRODUCT_ACTIVATED"
CLIENT_STATUS_CHANGED = "CLIENT_STATUS_CHANGED"

# ── In-process handler registry ────────────────────────────────────────────────
_handlers: dict[str, list[Callable]] = defaultdict(list)


def subscribe(event_name: str, handler: Callable) -> None:
    """Register an in-process handler for an event."""
    _handlers[event_name].append(handler)


def _persist(event_name: str, payload: dict[str, Any], tenant_id: str | None) -> None:
    """Write the event to system_events table (best-effort)."""
    try:
        from app.db.models import SystemEvent
        from app.db.session import SessionLocal
        db = SessionLocal()
        db.add(SystemEvent(event_name=event_name, payload=json.dumps(payload), tenant_id=tenant_id))
        db.commit()
        db.close()
    except Exception as exc:
        logger.warning("Event persistence failed for %s: %s", event_name, exc)


def publish(event_name: str, payload: dict[str, Any]) -> None:
    """Publish an event to all registered in-process handlers and persist it."""
    tenant_id: str | None = payload.get("tenant_id")
    envelope: dict[str, Any] = {
        "event": event_name,
        "payload": payload,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("EVENT %s payload=%s", event_name, json.dumps(payload))

    # Persist to DB
    _persist(event_name, payload, tenant_id)

    # Invoke handlers
    for handler in _handlers.get(event_name, []):
        try:
            result = handler(envelope)
            if asyncio.iscoroutine(result):
                asyncio.ensure_future(result)
        except Exception as exc:
            logger.exception("Handler %s failed for event %s: %s", handler.__name__, event_name, exc)
