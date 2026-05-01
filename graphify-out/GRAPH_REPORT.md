# Graph Report - GridSphere  (2026-04-30)

## Corpus Check
- 89 files · ~20,790 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 228 nodes · 258 edges · 26 communities detected
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]

## God Nodes (most connected - your core abstractions)
1. `Base` - 17 edges
2. `TimestampMixin` - 16 edges
3. `run_seed()` - 13 edges
4. `Client` - 13 edges
5. `ClientProduct` - 13 edges
6. `ClientUser` - 13 edges
7. `_seed_pricing_and_crm()` - 6 edges
8. `Plan` - 6 edges
9. `User` - 5 edges
10. `Product` - 5 edges

## Surprising Connections (you probably didn't know these)
- `run_seed()` --calls--> `get_password_hash()`  [INFERRED]
  backend/app/db/seed.py → backend/app/core/security.py
- `PlanRead` --uses--> `Plan`  [INFERRED]
  backend/app/pricing/schemas.py → backend/app/db/models.py
- `_seed_pricing_and_crm()` --calls--> `Plan`  [INFERRED]
  backend/app/db/seed.py → backend/app/db/models.py
- `Client` --uses--> `Base`  [INFERRED]
  backend/app/db/models.py → backend/app/db/base.py
- `ClientProduct` --uses--> `Base`  [INFERRED]
  backend/app/db/models.py → backend/app/db/base.py

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
Cohesion: 0.11
Nodes (27): AgentRead, AnalyticsPoint, FunnelPoint, BaseModel, create_client(), auto_tenant_id(), ClientCreate, ClientProductCreate (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.38
Nodes (16): Base, Base, Agent, Customer, Deployment, Expense, InfrastructureMetric, Plan (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (10): login(), LoginRequest, TokenResponse, UserRead, BaseSettings, get_settings(), Settings, create_access_token() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (5): addUser(), removeUser(), set(), toggleProduct(), updateUser()

### Community 4 - "Community 4"
Cohesion: 0.6
Nodes (3): get_client(), _load_client(), update_client_status()

### Community 6 - "Community 6"
Cohesion: 0.83
Nodes (3): get_product(), list_products(), serialize_product()

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (1): PlanRead

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (1): CRM and Pricing schema  Revision ID: 0002_crm_pricing_schema Revises: 0001_initi

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (1): initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date

### Community 11 - "Community 11"
Cohesion: 0.5
Nodes (4): BuildGrid Product, CampusGrid Product, FarmGrid Product, GridSphere Platform

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (2): executive_dashboard(), _revenue_for()

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (2): getJson(), mock()

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): GridSphere backend application.

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): Product portfolio endpoints.

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Pricing plans endpoints.

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Executive dashboard endpoints.

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): Database session and model declarations.

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): Task and product factory endpoints.

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): Infrastructure monitoring endpoints.

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): AI workforce endpoints.

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): Core settings and security helpers.

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): CRM — client onboarding and management endpoints.

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): Authentication endpoints.

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Deployment endpoints.

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): Mock-First Resilience Pattern

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): AI Agent Workflow Pipeline

## Knowledge Gaps
- **19 isolated node(s):** `GridSphere backend application.`, `Product portfolio endpoints.`, `Pricing plans endpoints.`, `Executive dashboard endpoints.`, `Database session and model declarations.` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (4 nodes): `schemas.py`, `from_orm()`, `PlanRead`, `savings_percent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (4 nodes): `0002_crm_pricing_schema.py`, `downgrade()`, `CRM and Pricing schema  Revision ID: 0002_crm_pricing_schema Revises: 0001_initi`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (4 nodes): `0001_initial_schema.py`, `downgrade()`, `initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (3 nodes): `router.py`, `executive_dashboard()`, `_revenue_for()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `api.ts`, `getJson()`, `mock()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `GridSphere backend application.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `__init__.py`, `Product portfolio endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `__init__.py`, `Pricing plans endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `__init__.py`, `Executive dashboard endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `__init__.py`, `Database session and model declarations.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `__init__.py`, `Task and product factory endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `__init__.py`, `Infrastructure monitoring endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `AI workforce endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `__init__.py`, `Core settings and security helpers.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `__init__.py`, `CRM — client onboarding and management endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `Authentication endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `__init__.py`, `Deployment endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (1 nodes): `Mock-First Resilience Pattern`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (1 nodes): `AI Agent Workflow Pipeline`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TokenResponse` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `Base` (e.g. with `TimestampMixin` and `User`) actually correct?**
  _`Base` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `run_seed()` (e.g. with `User` and `get_password_hash()`) actually correct?**
  _`run_seed()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GridSphere backend application.`, `Product portfolio endpoints.`, `Pricing plans endpoints.` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._