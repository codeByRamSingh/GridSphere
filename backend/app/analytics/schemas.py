from pydantic import BaseModel


class AnalyticsPoint(BaseModel):
    name: str
    value: float | None = None
    customers: int | None = None


class FunnelPoint(BaseModel):
    name: str
    value: int
