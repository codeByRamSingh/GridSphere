"""SupportAgent — analyses tenant activity/log streams and auto-resolves issues.

Input payload:
    {
        "tenant_id": str,
        "logs": [{"level": "error"|"warning"|"info", "message": str, "ts": str}, ...],
        "activity": [{"event": str, "user": str, "ts": str}, ...],
    }

Output:
    {
        "tenant_id": str,
        "alert_level": "ok" | "warning" | "critical",
        "alerts": [{"severity": str, "message": str}],
        "actions_taken": [str],
        "auto_resolved": bool,
    }
"""

from typing import Any

from .base import BaseAgent


class SupportAgent(BaseAgent):
    name = "SupportAgent"

    def context_loader(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        logs = input_payload.get("logs", [])
        return {
            "tenant_id": input_payload.get("tenant_id"),
            "error_logs": [l for l in logs if l.get("level") in ("error", "critical")],
            "warning_logs": [l for l in logs if l.get("level") == "warning"],
            "activity": input_payload.get("activity", []),
            "total_log_count": len(logs),
        }

    def decision_engine(self, context: dict[str, Any]) -> dict[str, Any]:
        errors = len(context["error_logs"])
        warnings = len(context["warning_logs"])
        activity_count = len(context["activity"])

        alerts: list[dict[str, str]] = []
        actions: list[str] = []

        if errors >= 10:
            alerts.append({"severity": "critical", "message": f"{errors} errors detected — immediate review required"})
            actions.extend(["escalate_to_on_call", "create_incident_ticket"])
        elif errors >= 3:
            alerts.append({"severity": "warning", "message": f"{errors} errors in current session"})
            actions.append("create_support_ticket")

        if warnings >= 20:
            alerts.append({"severity": "warning", "message": f"High warning volume: {warnings} events"})
            actions.append("notify_account_manager")

        if activity_count == 0 and context["total_log_count"] > 0:
            alerts.append({"severity": "info", "message": "No user activity detected — possible login issue"})
            actions.append("check_auth_service")

        alert_level = (
            "critical" if any(a["severity"] == "critical" for a in alerts)
            else "warning" if alerts
            else "ok"
        )

        return {
            "tenant_id": context["tenant_id"],
            "alert_level": alert_level,
            "alerts": alerts,
            "actions": actions,
        }

    def action_executor(self, decision: dict[str, Any]) -> dict[str, Any]:
        # Production: call PagerDuty, Zendesk, Slack webhook, etc.
        return {
            "tenant_id": decision["tenant_id"],
            "alert_level": decision["alert_level"],
            "alerts_raised": len(decision["alerts"]),
            "actions_taken": decision["actions"],
            "auto_resolved": len(decision["actions"]) > 0,
        }
