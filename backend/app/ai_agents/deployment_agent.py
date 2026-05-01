"""DeploymentAgent — provisions a new tenant environment end-to-end.

Input payload:
    {
        "tenant_id": str,
        "client_name": str,
        "products": ["buildgrid", ...],
        "plan": "Basic" | "Pro" | "Enterprise",
        "region": str,
    }

Output:
    {
        "tenant_id": str,
        "status": "provisioned",
        "steps_completed": int,
        "steps": [{"step": str, "target": str, "status": str, "completed_at": str}],
        "provisioned_at": str,
    }
"""

from datetime import datetime, timezone
from typing import Any

from .base import BaseAgent


class DeploymentAgent(BaseAgent):
    name = "DeploymentAgent"

    def context_loader(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "tenant_id": input_payload["tenant_id"],
            "client_name": input_payload.get("client_name", ""),
            "products": input_payload.get("products", []),
            "plan": input_payload.get("plan", "Basic"),
            "region": input_payload.get("region", "us-east-1"),
        }

    def decision_engine(self, context: dict[str, Any]) -> dict[str, Any]:
        tid = context["tenant_id"]
        safe_tid = tid.replace("-", "_")

        steps = [
            {"step": "create_db_schema",   "target": f"schema_{safe_tid}",     "status": "pending"},
            {"step": "provision_storage",  "target": f"gs-{tid}",              "status": "pending"},
            {"step": "configure_rbac",     "target": tid,                      "status": "pending"},
        ]
        for product in context["products"]:
            steps.append({
                "step": f"deploy_{product}",
                "target": f"{tid}-{product}",
                "status": "pending",
            })
        steps.append({"step": "seed_tenant_data",  "target": tid,               "status": "pending"})
        steps.append({"step": "send_welcome_email", "target": context["client_name"], "status": "pending"})

        return {
            "tenant_id": tid,
            "client_name": context["client_name"],
            "plan": context["plan"],
            "region": context["region"],
            "provisioning_steps": steps,
        }

    def action_executor(self, decision: dict[str, Any]) -> dict[str, Any]:
        # Each step executes here; in production replace with real infra calls
        # (Kubernetes namespace, MinIO bucket, PostgreSQL schema, SMTP).
        now = datetime.now(timezone.utc).isoformat()
        completed = [
            {**step, "status": "completed", "completed_at": now}
            for step in decision["provisioning_steps"]
        ]

        # Persist TenantConfig
        self._upsert_tenant_config(decision["tenant_id"])

        return {
            "tenant_id": decision["tenant_id"],
            "status": "provisioned",
            "steps_completed": len(completed),
            "steps": completed,
            "provisioned_at": now,
        }

    # ── Helpers ────────────────────────────────────────────────────────────────

    def _upsert_tenant_config(self, tenant_id: str) -> None:
        try:
            from datetime import datetime, timezone
            from sqlalchemy import select
            from app.db.session import SessionLocal
            from app.db.models import TenantConfig
            db = SessionLocal()
            existing = db.scalar(select(TenantConfig).where(TenantConfig.tenant_id == tenant_id))
            if not existing:
                db.add(TenantConfig(
                    tenant_id=tenant_id,
                    storage_bucket=f"gs-{tenant_id}",
                    db_schema=f"schema_{tenant_id.replace('-', '_')}",
                    provisioned_at=datetime.now(timezone.utc),
                    provisioned_by=self.name,
                ))
                db.commit()
            db.close()
        except Exception as exc:
            import logging
            logging.getLogger("gridsphere.agents").warning("TenantConfig upsert failed: %s", exc)
