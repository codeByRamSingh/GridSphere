from pydantic import BaseModel


class FinancePoint(BaseModel):
    name: str
    revenue: float
    expenses: float


class ExpenseBreakdown(BaseModel):
    name: str
    value: float


class ProductProfitability(BaseModel):
    name: str
    revenue: float
    expenses: float
