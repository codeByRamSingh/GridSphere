# Graph Report - GridSphere  (2026-05-01)

## Corpus Check
- 127 files · ~36,207 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 404 nodes · 627 edges · 38 communities detected
- Extraction: 62% EXTRACTED · 38% INFERRED · 0% AMBIGUOUS · INFERRED: 240 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]

## God Nodes (most connected - your core abstractions)
1. `Base` - 28 edges
2. `TimestampMixin` - 24 edges
3. `DeploymentAgent` - 24 edges
4. `ClientProduct` - 21 edges
5. `Client` - 20 edges
6. `AgentRun` - 19 edges
7. `BGProject` - 18 edges
8. `BGBOQItem` - 18 edges
9. `BGVendor` - 18 edges
10. `BGPurchaseOrder` - 18 edges

## Surprising Connections (you probably didn't know these)
- `run_seed()` --calls--> `get_password_hash()`  [INFERRED]
  backend/app/db/seed.py → backend/app/core/security.py
- `Base` --uses--> `Persistent log of every AI agent execution.`  [INFERRED]
  backend/app/db/base.py → backend/app/db/models.py
- `Base` --uses--> `Event bus persistence — every published event is stored here.`  [INFERRED]
  backend/app/db/base.py → backend/app/db/models.py
- `User` --uses--> `FastAPI dependencies for authentication and authorisation.`  [INFERRED]
  backend/app/db/models.py → backend/app/core/deps.py
- `User` --uses--> `Factory that returns a dependency enforcing one of the given roles.`  [INFERRED]
  backend/app/db/models.py → backend/app/core/deps.py

## Hyperedges (group relationships)
- **FastAPI JWT Authentication Flow** — auth_login, security_verifypassword, security_createaccesstoken, session_getdb [EXTRACTED 0.95]
- **Product Data Query and Serialization Pipeline** — products_listproducts, products_serializeproduct, models_product, models_revenue [INFERRED 0.85]
- **Database Schema Lifecycle: ORM Models, Alembic Migration, Seed** — base_base, migration_0001_initialschema, seed_runseed [INFERRED 0.88]
- **Executive Dashboard Aggregates All Domain Models** — dashboard_executive_dashboard, dbmodels_product, dbmodels_customer, dbmodels_agent, dbmodels_task, dbmodels_revenue, dbmodels_expense [EXTRACTED 1.00]
- **Finance Dashboard Revenue and Expense Reporting Flow** — finance_finance_dashboard, dbmodels_revenue, dbmodels_expense, dbmodels_product [EXTRACTED 1.00]
- **Infrastructure and Deployment Health Monitoring Pattern** — infrastructure_infrastructure_dashboard, deployments_list_deployments, dbmodels_deployment, dbmodels_infrastructuremetric [INFERRED 0.85]
- **React Query Data Fetching Pattern with Mock Fallback** — providers_providers, page_dashboardpage, page_analyticspage, page_financepage, page_infrastructurepage, page_aiworkforcepage [EXTRACTED 0.95]
- **Drag-and-Drop Kanban Board Pattern** — page_productfactorypage, page_factorycolumn, page_ideacard, store_usefactorystore [EXTRACTED 0.95]
- **Shared Global Type System Consumed Across All Pages** — types_product, types_agent, types_productidea, types_chartpoint, types_kpi, types_activity [EXTRACTED 0.90]
- **Dashboard Card Composition Pattern** — card_card, card_cardheader, card_cardcontent, card_cardtitle [EXTRACTED 0.95]
- **Mock-First API Fallback Flow** — api_dashboardapi, api_getjson, api_mock [EXTRACTED 1.00]
- **App Shell Layout Composition** — app_shell_appshell, sidebar_sidebar, top_nav_topnav, app_shell_mobilenav [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (31): AgentRead, AnalyticsPoint, FunnelPoint, BaseModel, BGBOQItemCreate, BGBOQItemRead, BGExpenseCreate, BGExpenseRead (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (27): create_client(), get_client(), _load_client(), update_client_status(), auto_tenant_id(), ClientCreate, ClientProductCreate, ClientProductRead (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (17): DeploymentAgent, _celery_dispatch(), DeployPayload, dispatch_deployment_agent(), dispatch_sales_agent(), dispatch_support_agent(), LeadPayload, AI agent dispatch and run history endpoints.  POST /api/v1/ai-agents/dispatch/sa (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (14): login(), LoginRequest, TokenResponse, UserRead, BaseSettings, get_settings(), Settings, get_current_user() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.34
Nodes (18): Base, Base, Agent, Customer, Deployment, Expense, InfrastructureMetric, Plan (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (9): create_boq_item(), create_expense(), create_project(), create_purchase_order(), create_vendor(), delete_project(), get_project(), _load_project() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (11): ABC, action_executor(), BaseAgent, context_loader(), decision_engine(), _iso(), BaseAgent — abstract contract every AI agent must implement.  Each agent is a th, Execute the full pipeline and return a structured result dict. (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.23
Nodes (13): _persist_run(), run_deployment_agent(), run_sales_agent(), run_support_agent(), _persist(), publish(), In-process event bus with optional Redis pub/sub and DB persistence.  Usage:, Register an in-process handler for an event. (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (6): handleOpenWorkspace(), handleOpenWorkspace(), handleOpenWorkspace(), getProductConfig(), getWorkspaceUrl(), handleOpenWorkspace()

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (5): addUser(), removeUser(), set(), toggleProduct(), updateUser()

### Community 11 - "Community 11"
Cohesion: 0.83
Nodes (3): get_product(), list_products(), serialize_product()

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (1): PlanRead

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (1): Role-Based Access Control definitions.  Role hierarchy (higher = more permission

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (1): GridSphere Core: AgentRun, SystemEvent, TenantConfig  Revision ID: 0004_gridsphe

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): BuildGrid module schema  Revision ID: 0003_buildgrid Revises: 0002_crm_pricing_s

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (1): CRM and Pricing schema  Revision ID: 0002_crm_pricing_schema Revises: 0001_initi

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (1): initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (4): BuildGrid Product, CampusGrid Product, FarmGrid Product, GridSphere Platform

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): executive_dashboard(), _revenue_for()

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (2): getJson(), mock()

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Celery application — configured via the same Settings object as FastAPI.

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): GridSphere backend application.

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): Product portfolio endpoints.

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): Pricing plans endpoints.

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): Executive dashboard endpoints.

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): Database session and model declarations.

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Task and product factory endpoints.

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): Infrastructure monitoring endpoints.

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): AI workforce endpoints.

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Core settings and security helpers.

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): CRM — client onboarding and management endpoints.

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): Authentication endpoints.

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Deployment endpoints.

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (1): Load relevant context from DB / APIs / config.

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): Produce a structured decision.          # LLM INTEGRATION POINT         To use a

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): Execute the decision (write to DB, call APIs, send notifications).

### Community 109 - "Community 109"
Cohesion: 1.0
Nodes (1): Mock-First Resilience Pattern

### Community 110 - "Community 110"
Cohesion: 1.0
Nodes (1): AI Agent Workflow Pipeline

## Knowledge Gaps
- **28 isolated node(s):** `Celery application — configured via the same Settings object as FastAPI.`, `GridSphere backend application.`, `Product portfolio endpoints.`, `Pricing plans endpoints.`, `Executive dashboard endpoints.` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 12`** (4 nodes): `schemas.py`, `from_orm()`, `PlanRead`, `savings_percent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (4 nodes): `rbac.py`, `has_permission()`, `has_role()`, `Role-Based Access Control definitions.  Role hierarchy (higher = more permission`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (4 nodes): `0004_gridsphere_core.py`, `downgrade()`, `GridSphere Core: AgentRun, SystemEvent, TenantConfig  Revision ID: 0004_gridsphe`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `0003_buildgrid.py`, `downgrade()`, `BuildGrid module schema  Revision ID: 0003_buildgrid Revises: 0002_crm_pricing_s`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `0002_crm_pricing_schema.py`, `downgrade()`, `CRM and Pricing schema  Revision ID: 0002_crm_pricing_schema Revises: 0001_initi`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (4 nodes): `0001_initial_schema.py`, `downgrade()`, `initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (3 nodes): `router.py`, `executive_dashboard()`, `_revenue_for()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (3 nodes): `api.ts`, `getJson()`, `mock()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `celery_app.py`, `Celery application — configured via the same Settings object as FastAPI.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `GridSphere backend application.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `__init__.py`, `Product portfolio endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `__init__.py`, `Pricing plans endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `__init__.py`, `Executive dashboard endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `__init__.py`, `Database session and model declarations.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `__init__.py`, `Task and product factory endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `__init__.py`, `Infrastructure monitoring endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `AI workforce endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `__init__.py`, `Core settings and security helpers.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `__init__.py`, `CRM — client onboarding and management endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `Authentication endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `__init__.py`, `Deployment endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (1 nodes): `Load relevant context from DB / APIs / config.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (1 nodes): `Produce a structured decision.          # LLM INTEGRATION POINT         To use a`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (1 nodes): `Execute the decision (write to DB, call APIs, send notifications).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (1 nodes): `Mock-First Resilience Pattern`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `AI Agent Workflow Pipeline`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DeploymentAgent` connect `Community 2` to `Community 1`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Base` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `AgentRun` connect `Community 2` to `Community 1`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `Base` (e.g. with `TimestampMixin` and `User`) actually correct?**
  _`Base` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `DeploymentAgent` (e.g. with `DeployTenantPayload` and `DeployProductPayload`) actually correct?**
  _`DeploymentAgent` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Celery application — configured via the same Settings object as FastAPI.`, `GridSphere backend application.`, `Product portfolio endpoints.` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._