from pydantic import BaseModel, Field


class TaskRead(BaseModel):
    id: int
    title: str
    priority: str
    status: str
    due_date: str | None = Field(alias="dueDate")
    product_id: int | None = Field(alias="productId")
    agent_id: int | None = Field(alias="agentId")


class ProductIdeaRead(BaseModel):
    id: str
    title: str
    stage: str
    market_size: str = Field(alias="marketSize")
    estimated_revenue: str = Field(alias="estimatedRevenue")
    category: str
    priority: str
    assigned_team: str = Field(alias="assignedTeam")
