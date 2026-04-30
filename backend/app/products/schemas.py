from pydantic import BaseModel, ConfigDict, Field


class ChartPoint(BaseModel):
    name: str
    value: float | None = None
    revenue: float | None = None
    expenses: float | None = None
    customers: int | None = None
    products: int | None = None
    buildGrid: float | None = None
    campusGrid: float | None = None
    farmGrid: float | None = None


class ProductRead(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    slug: str
    name: str
    description: str
    market: str
    stage: str
    revenue: float
    active_users: int = Field(alias="activeUsers")
    growth: float
    open_bugs: int = Field(alias="openBugs")
    deployment_status: str = Field(alias="deploymentStatus")
    health: int
    owner: str
    next_milestone: str = Field(alias="nextMilestone")
    mrr_series: list[ChartPoint] = Field(default_factory=list, alias="mrrSeries")
    adoption: list[ChartPoint] = Field(default_factory=list)
