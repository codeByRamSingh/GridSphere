# GridSphere

GridSphere is a production-oriented SaaS mission control platform for managing multiple SaaS businesses and future AI workforce operations.

Current products:

- BuildGrid: interior and construction ERP
- CampusGrid: education ERP
- FarmGrid: smart agriculture ERP

## What Is Included

- Next.js 14 App Router frontend with TypeScript, TailwindCSS, shadcn-style components, Framer Motion, Recharts, Zustand, React Query, and Lucide icons
- FastAPI backend with modular domains for auth, products, finance, infrastructure, analytics, agents, tasks, customers, and deployments
- JWT-ready authentication endpoints
- PostgreSQL schema using SQLAlchemy models and Alembic migration
- Seed data for products, revenues, customers, expenses, agents, tasks, deployments, infrastructure metrics, and product ideas
- Docker Compose stack for frontend, backend, and PostgreSQL

## Project Structure

```text
GridSphere/
  frontend/
    app/
    components/
    lib/
    store/
    types/
  backend/
    app/
      auth/
      products/
      finance/
      infrastructure/
      analytics/
      agents/
      tasks/
      customers/
      deployments/
      db/
    alembic/
  docker-compose.yml
```

## Run With Docker

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- Backend docs: http://localhost:8000/docs

The backend container runs Alembic migrations and seeds mock operating data on startup.

Seed admin credentials:

- Email: `admin@gridsphere.local`
- Password: `gridsphere-admin`

## Run Locally

Start PostgreSQL first, then:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload
```

In another terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Frontend Pages

- `/dashboard`: executive KPIs, revenue growth, product growth, expenses, activity feed, quick actions
- `/products`: BuildGrid, CampusGrid, and FarmGrid portfolio cards
- `/products/[slug]`: product detail view with MRR and adoption charts
- `/product-factory`: drag-and-drop startup Kanban workflow
- `/ai-workforce`: AI agent cards, costs, task status, and activity logs
- `/infrastructure`: uptime, containers, API usage, GPU, LLM workloads, storage, logs, alerts
- `/finance`: MRR, ARR, burn, runway, expense breakdown, product profitability
- `/analytics`: acquisition, churn, funnel, geography, adoption metrics
- `/settings`: workspace and governance controls

## API Surface

All API routes are under `/api/v1`.

- `POST /auth/login`
- `GET /dashboard/executive`
- `GET /products`
- `GET /products/{slug}`
- `GET /agents`
- `GET /infrastructure`
- `GET /finance`
- `GET /analytics`
- `GET /tasks`
- `GET /product-ideas`
- `GET /customers`
- `GET /deployments`

## Notes

The frontend is mock-first and resilient: if `NEXT_PUBLIC_API_URL` is not configured or the API is unavailable, React Query falls back to local mock data. This keeps dashboard development fast while preserving backend-ready contracts.
