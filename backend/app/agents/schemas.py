from pydantic import BaseModel, ConfigDict, Field


class AgentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    role: str
    current_task: str = Field(alias="currentTask")
    status: str
    token_cost: float = Field(alias="tokenCost")
    completed_tasks: int = Field(alias="completedTasks")
    efficiency: int
