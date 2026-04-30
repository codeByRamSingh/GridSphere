# Graph Report - .  (2026-04-30)

## Corpus Check
- Corpus is ~13,503 words - fits in a single context window. You may not need a graph.

## Summary
- 368 nodes · 389 edges · 56 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.77)
- Token cost: 14,000 input · 4,200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Analytics & Routing Layer|Analytics & Routing Layer]]
- [[_COMMUNITY_AI Workforce Interface|AI Workforce Interface]]
- [[_COMMUNITY_Mock-First API & Data Layer|Mock-First API & Data Layer]]
- [[_COMMUNITY_Business Domain Aggregators|Business Domain Aggregators]]
- [[_COMMUNITY_Pydantic Schema Layer|Pydantic Schema Layer]]
- [[_COMMUNITY_Database & ORM Layer|Database & ORM Layer]]
- [[_COMMUNITY_UI Component Library|UI Component Library]]
- [[_COMMUNITY_Auth & JWT Security|Auth & JWT Security]]
- [[_COMMUNITY_FastAPI Router Registry|FastAPI Router Registry]]
- [[_COMMUNITY_TypeScript Type System|TypeScript Type System]]
- [[_COMMUNITY_Layout & Navigation Shell|Layout & Navigation Shell]]
- [[_COMMUNITY_Products Router|Products Router]]
- [[_COMMUNITY_Alembic Migrations|Alembic Migrations]]
- [[_COMMUNITY_Dashboard Router|Dashboard Router]]
- [[_COMMUNITY_API Client|API Client]]
- [[_COMMUNITY_React Root & Providers|React Root & Providers]]
- [[_COMMUNITY_App Init|App Init]]
- [[_COMMUNITY_Products Init|Products Init]]
- [[_COMMUNITY_Dashboard Init|Dashboard Init]]
- [[_COMMUNITY_DB Init|DB Init]]
- [[_COMMUNITY_Tasks Init|Tasks Init]]
- [[_COMMUNITY_Infrastructure Init|Infrastructure Init]]
- [[_COMMUNITY_Agents Init|Agents Init]]
- [[_COMMUNITY_Core Init|Core Init]]
- [[_COMMUNITY_Auth Init|Auth Init]]
- [[_COMMUNITY_Deployments Init|Deployments Init]]
- [[_COMMUNITY_Infrastructure Page|Infrastructure Page]]
- [[_COMMUNITY_Health Check|Health Check]]
- [[_COMMUNITY_User Read Schema|User Read Schema]]
- [[_COMMUNITY_Analytics Funnel|Analytics Funnel]]
- [[_COMMUNITY_Analytics Module|Analytics Module]]
- [[_COMMUNITY_Customers Module|Customers Module]]
- [[_COMMUNITY_Finance Module|Finance Module]]
- [[_COMMUNITY_Dashboard Module|Dashboard Module]]
- [[_COMMUNITY_Tasks Module|Tasks Module]]
- [[_COMMUNITY_Infrastructure Module|Infrastructure Module]]
- [[_COMMUNITY_Agents Module|Agents Module]]
- [[_COMMUNITY_Deployments Module|Deployments Module]]
- [[_COMMUNITY_Pydantic Settings Dep|Pydantic Settings Dep]]
- [[_COMMUNITY_Alembic Dep|Alembic Dep]]
- [[_COMMUNITY_Uvicorn Dep|Uvicorn Dep]]
- [[_COMMUNITY_Tailwind Config Node|Tailwind Config Node]]
- [[_COMMUNITY_Next Config Node|Next Config Node]]
- [[_COMMUNITY_PostCSS Config Node|PostCSS Config Node]]
- [[_COMMUNITY_KPI Type|KPI Type]]
- [[_COMMUNITY_Activity Type|Activity Type]]
- [[_COMMUNITY_Global Region Type|Global Region Type]]
- [[_COMMUNITY_Command Alert Type|Command Alert Type]]
- [[_COMMUNITY_Agent Workflow Node Type|Agent Workflow Node Type]]
- [[_COMMUNITY_Phase Connector Type|Phase Connector Type]]
- [[_COMMUNITY_Nav Item Type|Nav Item Type]]
- [[_COMMUNITY_Page Header Component|Page Header Component]]
- [[_COMMUNITY_Command Alerts Mock|Command Alerts Mock]]
- [[_COMMUNITY_Global Regions Mock|Global Regions Mock]]
- [[_COMMUNITY_Factory Stages Mock|Factory Stages Mock]]
- [[_COMMUNITY_Product Ideas Mock|Product Ideas Mock]]

## God Nodes (most connected - your core abstractions)
1. `dashboardApi Client Object` - 20 edges
2. `Base` - 13 edges
3. `Base (DeclarativeBase)` - 13 edges
4. `run_seed()` - 12 edges
5. `TimestampMixin` - 12 edges
6. `TimestampMixin` - 10 edges
7. `Product ORM model` - 10 edges
8. `executive_dashboard` - 9 edges
9. `ProductCard Component` - 9 edges
10. `finance_dashboard` - 8 edges

## Surprising Connections (you probably didn't know these)
- `getJson Fetch Helper` --implements--> `Mock-First Resilience Pattern`  [INFERRED]
  frontend/lib/api.ts → README.md
- `products Mock Dataset` --references--> `BuildGrid Product`  [INFERRED]
  frontend/lib/mock-data.ts → README.md
- `products Mock Dataset` --references--> `CampusGrid Product`  [INFERRED]
  frontend/lib/mock-data.ts → README.md
- `products Mock Dataset` --references--> `FarmGrid Product`  [INFERRED]
  frontend/lib/mock-data.ts → README.md
- `agents Mock Dataset` --references--> `AI Agent Workflow Pipeline`  [INFERRED]
  frontend/lib/mock-data.ts → README.md

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

### Community 0 - "Analytics & Routing Layer"
Cohesion: 0.09
Nodes (38): run_migrations_offline, run_migrations_online, analytics_dashboard endpoint (GET /analytics), AnalyticsPoint schema, Analytics APIRouter, login endpoint (POST /auth/login), LoginRequest schema, Auth APIRouter (+30 more)

### Community 1 - "AI Workforce Interface"
Cohesion: 0.08
Nodes (29): AgentCard Component, AgentLogRow Component, AgentMetric Component, AIWorkforcePage Component, AnalyticsPage Component, DashboardPage Component, FactoryColumn Component, FactoryMetric Component (+21 more)

### Community 2 - "Mock-First API & Data Layer"
Cohesion: 0.07
Nodes (29): dashboardApi Client Object, getJson Fetch Helper, mock Data Delay Helper, acquisition Mock Dataset, activities Mock Dataset, agentLogs Mock Dataset, agents Mock Dataset, agentWorkflow Mock Dataset (+21 more)

### Community 3 - "Business Domain Aggregators"
Cohesion: 0.11
Nodes (27): AgentRead Schema, list_agents, list_customers, executive_dashboard, _revenue_for (helper), Agent DB Model, Customer DB Model, Deployment DB Model (+19 more)

### Community 4 - "Pydantic Schema Layer"
Cohesion: 0.12
Nodes (15): AgentRead, AnalyticsPoint, FunnelPoint, LoginRequest, UserRead, BaseModel, ExpenseBreakdown, FinancePoint (+7 more)

### Community 5 - "Database & ORM Layer"
Cohesion: 0.36
Nodes (15): Base, Base, Agent, Customer, Deployment, Expense, InfrastructureMetric, Product (+7 more)

### Community 6 - "UI Component Library"
Cohesion: 0.22
Nodes (17): ActivityFeed Component, Badge UI Component, badgeVariants CVA Config, Button UI Component, buttonVariants CVA Config, Card UI Component, CardContent UI Component, CardDescription UI Component (+9 more)

### Community 7 - "Auth & JWT Security"
Cohesion: 0.2
Nodes (8): login(), TokenResponse, BaseSettings, get_settings(), Settings, create_access_token(), get_password_hash(), verify_password()

### Community 8 - "FastAPI Router Registry"
Cohesion: 0.39
Nodes (9): Agents Router, Customers Router, Dashboard Router, Deployments Router, Finance Router, Infrastructure Router, FastAPI 0.111.0 Dependency, SQLAlchemy 2.0.31 Dependency (+1 more)

### Community 9 - "TypeScript Type System"
Cohesion: 0.29
Nodes (8): ChartPoint Type, Product Type, ProductCustomer Type, ProductDeployment Type, ProductRoadmapItem Type, ProductSupportTicket Type, ProductUsageMetric Type, Status Type

### Community 10 - "Layout & Navigation Shell"
Cohesion: 0.33
Nodes (7): AppShell Layout Component, MobileNav Layout Component, Input UI Component, navItems Navigation Config, Sidebar Layout Component, TopNav Layout Component, useWorkspaceStore Zustand Store

### Community 12 - "Products Router"
Cohesion: 0.83
Nodes (3): get_product(), list_products(), serialize_product()

### Community 13 - "Alembic Migrations"
Cohesion: 0.5
Nodes (1): initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date

### Community 15 - "Dashboard Router"
Cohesion: 1.0
Nodes (2): executive_dashboard(), _revenue_for()

### Community 19 - "API Client"
Cohesion: 1.0
Nodes (2): getJson(), mock()

### Community 20 - "React Root & Providers"
Cohesion: 0.67
Nodes (3): RootLayout Component, Providers Component, QueryClient Instance

### Community 22 - "App Init"
Cohesion: 1.0
Nodes (1): GridSphere backend application.

### Community 23 - "Products Init"
Cohesion: 1.0
Nodes (1): Product portfolio endpoints.

### Community 27 - "Dashboard Init"
Cohesion: 1.0
Nodes (1): Executive dashboard endpoints.

### Community 29 - "DB Init"
Cohesion: 1.0
Nodes (1): Database session and model declarations.

### Community 30 - "Tasks Init"
Cohesion: 1.0
Nodes (1): Task and product factory endpoints.

### Community 32 - "Infrastructure Init"
Cohesion: 1.0
Nodes (1): Infrastructure monitoring endpoints.

### Community 34 - "Agents Init"
Cohesion: 1.0
Nodes (1): AI workforce endpoints.

### Community 35 - "Core Init"
Cohesion: 1.0
Nodes (1): Core settings and security helpers.

### Community 36 - "Auth Init"
Cohesion: 1.0
Nodes (1): Authentication endpoints.

### Community 38 - "Deployments Init"
Cohesion: 1.0
Nodes (1): Deployment endpoints.

### Community 53 - "Infrastructure Page"
Cohesion: 1.0
Nodes (2): AlertItem Component, InfrastructurePage Component

### Community 76 - "Health Check"
Cohesion: 1.0
Nodes (1): healthcheck endpoint

### Community 77 - "User Read Schema"
Cohesion: 1.0
Nodes (1): UserRead schema

### Community 78 - "Analytics Funnel"
Cohesion: 1.0
Nodes (1): FunnelPoint schema

### Community 79 - "Analytics Module"
Cohesion: 1.0
Nodes (1): Analytics Module Init

### Community 80 - "Customers Module"
Cohesion: 1.0
Nodes (1): Customers Module Init

### Community 81 - "Finance Module"
Cohesion: 1.0
Nodes (1): Finance Module Init

### Community 82 - "Dashboard Module"
Cohesion: 1.0
Nodes (1): Dashboard Module Init

### Community 83 - "Tasks Module"
Cohesion: 1.0
Nodes (1): Tasks Module Init

### Community 84 - "Infrastructure Module"
Cohesion: 1.0
Nodes (1): Infrastructure Module Init

### Community 85 - "Agents Module"
Cohesion: 1.0
Nodes (1): Agents Module Init

### Community 86 - "Deployments Module"
Cohesion: 1.0
Nodes (1): Deployments Module Init

### Community 87 - "Pydantic Settings Dep"
Cohesion: 1.0
Nodes (1): pydantic-settings 2.3.4 Dependency

### Community 88 - "Alembic Dep"
Cohesion: 1.0
Nodes (1): Alembic 1.13.2 Dependency

### Community 89 - "Uvicorn Dep"
Cohesion: 1.0
Nodes (1): Uvicorn 0.30.1 Dependency

### Community 90 - "Tailwind Config Node"
Cohesion: 1.0
Nodes (1): Tailwind CSS Config

### Community 91 - "Next Config Node"
Cohesion: 1.0
Nodes (1): Next.js Config

### Community 92 - "PostCSS Config Node"
Cohesion: 1.0
Nodes (1): PostCSS Config

### Community 93 - "KPI Type"
Cohesion: 1.0
Nodes (1): Kpi Type

### Community 94 - "Activity Type"
Cohesion: 1.0
Nodes (1): Activity Type

### Community 95 - "Global Region Type"
Cohesion: 1.0
Nodes (1): GlobalRegion Type

### Community 96 - "Command Alert Type"
Cohesion: 1.0
Nodes (1): CommandAlert Type

### Community 97 - "Agent Workflow Node Type"
Cohesion: 1.0
Nodes (1): AgentWorkflowNode Type

### Community 98 - "Phase Connector Type"
Cohesion: 1.0
Nodes (1): PhaseTwoConnector Type

### Community 99 - "Nav Item Type"
Cohesion: 1.0
Nodes (1): NavItem Type

### Community 100 - "Page Header Component"
Cohesion: 1.0
Nodes (1): PageHeader Component

### Community 101 - "Command Alerts Mock"
Cohesion: 1.0
Nodes (1): commandAlerts Mock Dataset

### Community 102 - "Global Regions Mock"
Cohesion: 1.0
Nodes (1): globalRegions Mock Dataset

### Community 103 - "Factory Stages Mock"
Cohesion: 1.0
Nodes (1): factoryStages Mock Dataset

### Community 104 - "Product Ideas Mock"
Cohesion: 1.0
Nodes (1): productIdeas Mock Dataset

## Knowledge Gaps
- **103 isolated node(s):** `GridSphere backend application.`, `Product portfolio endpoints.`, `Executive dashboard endpoints.`, `Database session and model declarations.`, `Task and product factory endpoints.` (+98 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Alembic Migrations`** (4 nodes): `0001_initial_schema.py`, `downgrade()`, `initial GridSphere schema  Revision ID: 0001_initial_schema Revises: Create Date`, `upgrade()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Router`** (3 nodes): `router.py`, `executive_dashboard()`, `_revenue_for()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Client`** (3 nodes): `api.ts`, `getJson()`, `mock()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Init`** (2 nodes): `GridSphere backend application.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Products Init`** (2 nodes): `__init__.py`, `Product portfolio endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Init`** (2 nodes): `__init__.py`, `Executive dashboard endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DB Init`** (2 nodes): `__init__.py`, `Database session and model declarations.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tasks Init`** (2 nodes): `__init__.py`, `Task and product factory endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Infrastructure Init`** (2 nodes): `__init__.py`, `Infrastructure monitoring endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agents Init`** (2 nodes): `AI workforce endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Init`** (2 nodes): `__init__.py`, `Core settings and security helpers.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Init`** (2 nodes): `Authentication endpoints.`, `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Deployments Init`** (2 nodes): `__init__.py`, `Deployment endpoints.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Infrastructure Page`** (2 nodes): `AlertItem Component`, `InfrastructurePage Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Health Check`** (1 nodes): `healthcheck endpoint`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Read Schema`** (1 nodes): `UserRead schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Analytics Funnel`** (1 nodes): `FunnelPoint schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Analytics Module`** (1 nodes): `Analytics Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Customers Module`** (1 nodes): `Customers Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Finance Module`** (1 nodes): `Finance Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Module`** (1 nodes): `Dashboard Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tasks Module`** (1 nodes): `Tasks Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Infrastructure Module`** (1 nodes): `Infrastructure Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agents Module`** (1 nodes): `Agents Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Deployments Module`** (1 nodes): `Deployments Module Init`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pydantic Settings Dep`** (1 nodes): `pydantic-settings 2.3.4 Dependency`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Alembic Dep`** (1 nodes): `Alembic 1.13.2 Dependency`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Uvicorn Dep`** (1 nodes): `Uvicorn 0.30.1 Dependency`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config Node`** (1 nodes): `Tailwind CSS Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config Node`** (1 nodes): `Next.js Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config Node`** (1 nodes): `PostCSS Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `KPI Type`** (1 nodes): `Kpi Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Activity Type`** (1 nodes): `Activity Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Global Region Type`** (1 nodes): `GlobalRegion Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Command Alert Type`** (1 nodes): `CommandAlert Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agent Workflow Node Type`** (1 nodes): `AgentWorkflowNode Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase Connector Type`** (1 nodes): `PhaseTwoConnector Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Item Type`** (1 nodes): `NavItem Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Page Header Component`** (1 nodes): `PageHeader Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Command Alerts Mock`** (1 nodes): `commandAlerts Mock Dataset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Global Regions Mock`** (1 nodes): `globalRegions Mock Dataset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Factory Stages Mock`** (1 nodes): `factoryStages Mock Dataset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Ideas Mock`** (1 nodes): `productIdeas Mock Dataset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TokenResponse` connect `Auth & JWT Security` to `Pydantic Schema Layer`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `run_seed()` connect `Database & ORM Layer` to `Auth & JWT Security`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `Base` (e.g. with `TimestampMixin` and `User`) actually correct?**
  _`Base` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `run_seed()` (e.g. with `User` and `get_password_hash()`) actually correct?**
  _`run_seed()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GridSphere backend application.`, `Product portfolio endpoints.`, `Executive dashboard endpoints.` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Analytics & Routing Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `AI Workforce Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._