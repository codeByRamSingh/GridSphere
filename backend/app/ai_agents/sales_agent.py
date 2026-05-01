"""SalesAgent — qualifies inbound leads and suggests product + pricing.

Input payload:
    {
        "name": str,
        "email": str,
        "company": str,
        "industry": str,
        "company_size": "sme" | "mid-market" | "enterprise",
        "product_interest": ["buildgrid", ...],
        "tenant_id": str | None,
    }

Output:
    {
        "qualified": bool,
        "score": int,
        "recommended_product": str,
        "recommended_plan": str,
        "pricing_suggestion": {"plan": str, "monthly": int, "annual": int},
        "action_taken": "schedule_demo" | "nurture_sequence" | "disqualify",
        "crm_opportunity_created": bool,
    }
"""

from typing import Any

from .base import BaseAgent

_PLAN_PRICING = {"Basic": 4999, "Pro": 14999, "Enterprise": 39999}

_INDUSTRY_MAP: dict[str, tuple[str, int]] = {
    "construction":   ("buildgrid",   20),
    "infrastructure": ("buildgrid",   20),
    "real estate":    ("buildgrid",   15),
    "interior":       ("buildgrid",   15),
    "education":      ("campusgrid",  20),
    "university":     ("campusgrid",  20),
    "school":         ("campusgrid",  18),
    "agriculture":    ("farmgrid",    20),
    "farming":        ("farmgrid",    20),
    "agri":           ("farmgrid",    18),
    "healthcare":     ("gridsphere",  10),
    "logistics":      ("gridsphere",  10),
}


class SalesAgent(BaseAgent):
    name = "SalesAgent"

    def context_loader(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "lead": input_payload,
            "industry": input_payload.get("industry", "").lower().strip(),
            "company_size": input_payload.get("company_size", "sme").lower().strip(),
            "product_interest": [p.lower() for p in input_payload.get("product_interest", [])],
            "tenant_id": input_payload.get("tenant_id"),
        }

    def decision_engine(self, context: dict[str, Any]) -> dict[str, Any]:
        industry = context["industry"]
        size = context["company_size"]
        interests = context["product_interest"]

        score = 40

        # Industry scoring
        product_slug, industry_bonus = _INDUSTRY_MAP.get(industry, ("gridsphere", 0))
        score += industry_bonus

        # Explicit product interest bonus
        if interests:
            score += 10
            product_slug = interests[0]

        # Company size scoring + plan selection
        if size in ("enterprise", "large"):
            score += 20
            plan = "Enterprise"
        elif size in ("mid-market", "medium"):
            score += 15
            plan = "Pro"
        else:
            score += 5
            plan = "Basic"

        qualified = score >= 60

        pricing = _PLAN_PRICING[plan]
        return {
            "qualified": qualified,
            "score": min(score, 100),
            "recommended_product": product_slug,
            "recommended_plan": plan,
            "pricing_suggestion": {
                "plan": plan,
                "monthly": pricing,
                "annual": round(pricing * 12 * 0.8),
            },
            "next_action": (
                "schedule_demo" if qualified and size in ("enterprise", "mid-market", "large", "medium")
                else "nurture_sequence" if qualified
                else "disqualify"
            ),
        }

    def action_executor(self, decision: dict[str, Any]) -> dict[str, Any]:
        # Production: create opportunity via CRM API, enqueue email sequence
        return {
            "qualified": decision["qualified"],
            "score": decision["score"],
            "recommended_product": decision["recommended_product"],
            "recommended_plan": decision["recommended_plan"],
            "pricing_suggestion": decision["pricing_suggestion"],
            "action_taken": decision["next_action"],
            "crm_opportunity_created": decision["qualified"],
        }
