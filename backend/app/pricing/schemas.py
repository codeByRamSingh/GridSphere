import json

from pydantic import BaseModel, computed_field

from app.db.models import Plan


class PlanRead(BaseModel):
    id: int
    name: str
    price_monthly: float
    price_annual: float
    max_seats: int
    max_products: int
    features: list[str]

    @computed_field  # type: ignore[prop-decorator]
    @property
    def savings_percent(self) -> int:
        if self.price_monthly == 0:
            return 0
        annual_monthly = self.price_annual / 12
        return round((1 - annual_monthly / self.price_monthly) * 100)

    @classmethod
    def from_orm(cls, plan: Plan) -> "PlanRead":
        try:
            features = json.loads(plan.features)
        except (json.JSONDecodeError, TypeError):
            features = []
        return cls(
            id=plan.id,
            name=plan.name,
            price_monthly=plan.price_monthly,
            price_annual=plan.price_annual,
            max_seats=plan.max_seats,
            max_products=plan.max_products,
            features=features,
        )
