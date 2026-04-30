from pydantic import BaseModel


class InfrastructureMetricRead(BaseModel):
    label: str
    value: str
    progress: int
    status: str


class DeploymentLogRead(BaseModel):
    message: str
