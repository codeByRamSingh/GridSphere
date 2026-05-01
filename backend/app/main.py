from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.agents.router import router as agents_router
from app.ai_agents.router import router as ai_agents_router
from app.buildgrid.router import router as buildgrid_router
from app.analytics.router import router as analytics_router
from app.auth.router import router as auth_router
from app.core.config import get_settings
from app.crm.router import router as crm_router
from app.customers.router import router as customers_router
from app.dashboard.router import router as dashboard_router
from app.deployments.router import router as deployments_router
from app.finance.router import router as finance_router
from app.gridsphere_core.router import router as gridsphere_router
from app.infrastructure.router import router as infrastructure_router
from app.pricing.router import router as pricing_router
from app.products.router import router as products_router
from app.tasks.router import router as tasks_router

settings = get_settings()

app = FastAPI(
    title=settings.project_name,
    version="0.1.0",
    description="Parent operating system API for SaaS portfolio and AI workforce operations.",
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "service": "gridsphere-api"}


app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(dashboard_router, prefix=settings.api_v1_prefix)
app.include_router(products_router, prefix=settings.api_v1_prefix)
app.include_router(customers_router, prefix=settings.api_v1_prefix)
app.include_router(agents_router, prefix=settings.api_v1_prefix)
app.include_router(infrastructure_router, prefix=settings.api_v1_prefix)
app.include_router(finance_router, prefix=settings.api_v1_prefix)
app.include_router(analytics_router, prefix=settings.api_v1_prefix)
app.include_router(tasks_router, prefix=settings.api_v1_prefix)
app.include_router(deployments_router, prefix=settings.api_v1_prefix)
app.include_router(pricing_router, prefix=settings.api_v1_prefix)
app.include_router(crm_router, prefix=settings.api_v1_prefix)
app.include_router(buildgrid_router, prefix=settings.api_v1_prefix)
app.include_router(gridsphere_router, prefix=settings.api_v1_prefix)
app.include_router(ai_agents_router, prefix=settings.api_v1_prefix)
