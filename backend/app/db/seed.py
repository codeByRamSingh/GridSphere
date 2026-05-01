import json

from sqlalchemy import select

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.models import (
    Agent,
    BGBOQItem,
    BGExpense,
    BGProject,
    BGPurchaseOrder,
    BGVendor,
    Client,
    ClientProduct,
    ClientUser,
    Customer,
    Deployment,
    Expense,
    InfrastructureMetric,
    Plan,
    Product,
    ProductIdea,
    Revenue,
    Task,
    User,
)
from app.db.session import SessionLocal, engine


def _seed_pricing_and_crm(db, admin_id: int) -> None:
    plans = [
        Plan(
            name="Basic",
            price_monthly=4999,
            price_annual=47990,
            max_seats=25,
            max_products=1,
            features=json.dumps([
                "1 product access",
                "Up to 25 seats",
                "Standard support",
                "Core modules only",
                "Email onboarding",
            ]),
        ),
        Plan(
            name="Pro",
            price_monthly=14999,
            price_annual=143990,
            max_seats=100,
            max_products=2,
            features=json.dumps([
                "Up to 2 product access",
                "Up to 100 seats",
                "Priority support",
                "All modules included",
                "Dedicated account manager",
                "Client portal access",
                "AI agent assignment",
            ]),
        ),
        Plan(
            name="Enterprise",
            price_monthly=39999,
            price_annual=383990,
            max_seats=0,
            max_products=0,
            features=json.dumps([
                "Unlimited product access",
                "Unlimited seats",
                "24/7 dedicated support",
                "All modules + custom modules",
                "Dedicated account manager",
                "Client portal access",
                "AI agent assignment",
                "Custom integrations",
                "SLA guarantee",
                "White-label option",
            ]),
        ),
    ]
    db.add_all(plans)
    db.flush()

    plan_map = {p.name: p for p in plans}

    client_mt = Client(
        name="Mother Teresa Educational Trust",
        organization="Mother Teresa Educational Trust",
        contact_person="Sr. Maria Fernandes",
        email="admin@mtet.edu.in",
        phone="+91-80-4321-0000",
        industry="Education",
        tenant_id="mother-teresa-educational-trust",
        plan_id=plan_map["Enterprise"].id,
        region="South Asia",
        deal_value=480000,
        portal_enabled=True,
        onboarding_status="active",
        account_manager_id=admin_id,
        notes="Multi-school management system. 12 campuses across Karnataka. Requires custom academic calendar module.",
        tags="education, multi-campus, karnataka, enterprise",
    )
    client_bbu = Client(
        name="BBU Global Infra Pvt Ltd",
        organization="BBU Global Infra Pvt Ltd",
        contact_person="Bhupinder Singh",
        email="director@bbuglobal.in",
        phone="+91-11-6789-0000",
        industry="Construction",
        tenant_id="bbu-global-infra",
        plan_id=plan_map["Pro"].id,
        region="North India",
        deal_value=179988,
        portal_enabled=True,
        onboarding_status="active",
        account_manager_id=admin_id,
        notes="Interior and infrastructure execution company. 3 active project sites in Delhi NCR. Needs BOQ and vendor payment modules.",
        tags="construction, interior, delhi-ncr, pro",
    )
    db.add_all([client_mt, client_bbu])
    db.flush()

    db.add_all([
        ClientProduct(
            client_id=client_mt.id,
            product_slug="campusgrid",
            provisioned=True,
            enabled_modules=json.dumps(["admissions", "academics", "billing", "reports", "communication"]),
        ),
        ClientProduct(
            client_id=client_bbu.id,
            product_slug="buildgrid",
            provisioned=True,
            enabled_modules=json.dumps(["projects", "boq", "vendors", "finance", "procurement"]),
        ),
    ])

    db.add_all([
        ClientUser(client_id=client_mt.id, email="admin@mtet.edu.in", role="admin", invited=True, accepted=True),
        ClientUser(client_id=client_mt.id, email="principal@mtet.edu.in", role="manager", invited=True, accepted=False),
        ClientUser(client_id=client_bbu.id, email="director@bbuglobal.in", role="admin", invited=True, accepted=True),
        ClientUser(client_id=client_bbu.id, email="pm@bbuglobal.in", role="manager", invited=True, accepted=True),
        ClientUser(client_id=client_bbu.id, email="accounts@bbuglobal.in", role="viewer", invited=True, accepted=False),
    ])
    db.commit()
    print("Seed completed: CRM and pricing data loaded.")


def _seed_buildgrid(db, bbu_client_id: int) -> None:
    vendors = [
        BGVendor(tenant_id="bbu-global-infra", name="Premier Concrete Solutions", contact="Rajesh Sharma",  email="ops@premierconcrete.in",  category="Civil",       rating=4.7),
        BGVendor(tenant_id="bbu-global-infra", name="Metro Steel Fabricators",    contact="Vikram Singh",   email="orders@metrosteel.in",    category="Structural",  rating=4.5),
        BGVendor(tenant_id="bbu-global-infra", name="ElectroPro Systems",         contact="Anita Verma",    email="supply@electropro.in",    category="MEP",         rating=4.3),
        BGVendor(tenant_id="bbu-global-infra", name="HVAC Masters Ltd",           contact="Deepak Malhotra",email="projects@hvacmasters.in", category="MEP",         rating=4.6),
        BGVendor(tenant_id="bbu-global-infra", name="Apex Interior Works",        contact="Sunita Rathi",   email="bd@apexinterior.in",      category="Finishing",   rating=4.2),
    ]
    db.add_all(vendors)
    db.flush()
    v = {v.name: v for v in vendors}

    proj_riverside = BGProject(
        tenant_id="bbu-global-infra", client_id=bbu_client_id,
        name="Riverside Commercial Tower", location="Sector 62, Noida",
        status="active", start_date="2026-02-01", end_date="2026-11-30",
        total_budget=42_000_000, spent_to_date=14_700_000, completion_pct=35,
    )
    proj_greenfield = BGProject(
        tenant_id="bbu-global-infra", client_id=bbu_client_id,
        name="Greenfield Industrial Park – Phase 1", location="IMT Manesar, Haryana",
        status="active", start_date="2026-01-10", end_date="2026-12-31",
        total_budget=85_000_000, spent_to_date=22_100_000, completion_pct=26,
    )
    proj_metro = BGProject(
        tenant_id="bbu-global-infra", client_id=bbu_client_id,
        name="Metro Rail Junction Upgrade", location="Dwarka, New Delhi",
        status="planning", start_date="2026-06-01", end_date="2027-03-31",
        total_budget=121_000_000, spent_to_date=0, completion_pct=0,
    )
    proj_harbor = BGProject(
        tenant_id="bbu-global-infra", client_id=bbu_client_id,
        name="Harbor Logistics Hub", location="JNPT, Navi Mumbai",
        status="completed", start_date="2025-06-01", end_date="2026-03-15",
        total_budget=68_000_000, spent_to_date=66_200_000, completion_pct=100,
    )
    db.add_all([proj_riverside, proj_greenfield, proj_metro, proj_harbor])
    db.flush()

    db.add_all([
        BGBOQItem(project_id=proj_riverside.id, item_name="Concrete Foundation Work",     unit="m³",   quantity=500,   unit_cost=18_000,  total_cost=9_000_000,  category="Civil"),
        BGBOQItem(project_id=proj_riverside.id, item_name="Structural Steel Fabrication",  unit="MT",   quantity=200,   unit_cost=120_000, total_cost=24_000_000, category="Structural"),
        BGBOQItem(project_id=proj_riverside.id, item_name="Electrical Wiring & Conduits",  unit="m",    quantity=5000,  unit_cost=450,     total_cost=2_250_000,  category="MEP"),
        BGBOQItem(project_id=proj_riverside.id, item_name="HVAC System Installation",      unit="unit", quantity=1,     unit_cost=3_800_000, total_cost=3_800_000, category="MEP"),
        BGBOQItem(project_id=proj_riverside.id, item_name="Interior Finishing & Gypsum",   unit="sqft", quantity=8000,  unit_cost=375,     total_cost=3_000_000,  category="Finishing"),
        BGBOQItem(project_id=proj_greenfield.id, item_name="RCC Frame Construction",        unit="m³",   quantity=1200,  unit_cost=16_500,  total_cost=19_800_000, category="Civil"),
        BGBOQItem(project_id=proj_greenfield.id, item_name="Pre-Engineered Building Structure", unit="MT", quantity=480, unit_cost=115_000, total_cost=55_200_000, category="Structural"),
        BGBOQItem(project_id=proj_greenfield.id, item_name="Industrial Flooring",           unit="sqm",  quantity=12000, unit_cost=850,    total_cost=10_200_000, category="Finishing"),
    ])

    db.add_all([
        BGPurchaseOrder(project_id=proj_riverside.id,  vendor_id=v["Premier Concrete Solutions"].id, amount=8_750_000,  status="approved",  description="Foundation concrete supply – Phase 1 (500 m³)"),
        BGPurchaseOrder(project_id=proj_riverside.id,  vendor_id=v["Metro Steel Fabricators"].id,    amount=24_000_000, status="sent",      description="Structural steel – 200 MT supply and erection"),
        BGPurchaseOrder(project_id=proj_riverside.id,  vendor_id=v["ElectroPro Systems"].id,         amount=1_125_000,  status="draft",     description="Electrical conduit and wiring – floors 1–5"),
        BGPurchaseOrder(project_id=proj_riverside.id,  vendor_id=v["HVAC Masters Ltd"].id,           amount=3_800_000,  status="approved",  description="Full HVAC system – design, supply, and installation"),
        BGPurchaseOrder(project_id=proj_greenfield.id, vendor_id=v["Premier Concrete Solutions"].id, amount=19_800_000, status="fulfilled", description="RCC frame concrete supply – 1200 m³"),
        BGPurchaseOrder(project_id=proj_greenfield.id, vendor_id=v["Metro Steel Fabricators"].id,    amount=55_200_000, status="approved",  description="Pre-engineered building structure – 480 MT"),
    ])

    db.commit()
    print("Seed completed: BuildGrid projects, BOQ, vendors, and purchase orders loaded.")


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.scalar(select(Product).limit(1))
        if existing:
            # Core data already seeded — top-up CRM/pricing only if missing
            if not db.scalar(select(Plan).limit(1)):
                from app.db.models import User as UserModel
                admin = db.scalar(select(UserModel).limit(1))
                if admin:
                    _seed_pricing_and_crm(db, admin.id)
            else:
                print("Seed skipped: all data already exists.")
            return

        admin = User(
            email="admin@gridsphere.local",
            full_name="GridSphere Admin",
            hashed_password=get_password_hash("gridsphere-admin"),
            role="owner",
        )
        db.add(admin)

        products = [
            Product(
                slug="buildgrid",
                name="BuildGrid",
                description="Interior and construction ERP for projects, procurement, contractors, and site execution.",
                market="Construction operations",
                stage="Growth",
                revenue_monthly=84200,
                active_users=1284,
                growth_rate=18.4,
                open_bugs=14,
                deployment_status="deployed",
                health=93,
                owner="GridSphere Construction Studio",
                next_milestone="Vendor payments automation",
            ),
            Product(
                slug="campusgrid",
                name="CampusGrid",
                description="Education ERP for admissions, learning operations, staff workflows, and student lifecycle.",
                market="Education administration",
                stage="Beta",
                revenue_monthly=38400,
                active_users=742,
                growth_rate=12.7,
                open_bugs=9,
                deployment_status="building",
                health=86,
                owner="GridSphere Education Studio",
                next_milestone="Parent communication portal",
            ),
            Product(
                slug="farmgrid",
                name="FarmGrid",
                description="Smart agriculture ERP for crop plans, field telemetry, resource usage, and farm profitability.",
                market="Agri-tech operations",
                stage="MVP",
                revenue_monthly=16400,
                active_users=318,
                growth_rate=28.9,
                open_bugs=21,
                deployment_status="warning",
                health=78,
                owner="GridSphere Agriculture Studio",
                next_milestone="IoT irrigation dashboard",
            ),
        ]
        db.add_all(products)
        db.flush()

        revenue_map = {
            "buildgrid": [52000, 59000, 64000, 70500, 78200, 84200],
            "campusgrid": [18000, 21100, 24800, 29400, 33200, 38400],
            "farmgrid": [4200, 6100, 8500, 11100, 13900, 16400],
        }
        for product in products:
            for month, amount in zip(["Jan", "Feb", "Mar", "Apr", "May", "Jun"], revenue_map[product.slug], strict=True):
                db.add(Revenue(product_id=product.id, month=month, amount=amount))

        db.add_all(
            [
                Customer(product_id=products[0].id, name="Northline Builders", segment="Mid-market", seats=640, mrr=38500, region="North America"),
                Customer(product_id=products[0].id, name="UrbanCraft Interiors", segment="SMB", seats=644, mrr=45700, region="Europe"),
                Customer(product_id=products[1].id, name="North Valley Academy", segment="Education", seats=580, mrr=24800, region="North America"),
                Customer(product_id=products[1].id, name="Global Skills Institute", segment="Education", seats=162, mrr=13600, region="Asia Pacific"),
                Customer(product_id=products[2].id, name="Harvest Ridge Farms", segment="Agriculture", seats=318, mrr=16400, region="Middle East"),
            ]
        )

        expense_rows = [
            ("Engineering", "Jan", 14200, products[0].id),
            ("Infrastructure", "Jan", 9200, products[0].id),
            ("Sales", "Jan", 7300, products[1].id),
            ("AI/API", "Jan", 6100, None),
            ("Ops", "Jan", 4400, None),
            ("Engineering", "Feb", 15200, products[0].id),
            ("Infrastructure", "Feb", 9800, products[1].id),
            ("Sales", "Feb", 7600, products[1].id),
            ("AI/API", "Feb", 6500, None),
            ("Ops", "Feb", 4700, None),
            ("Engineering", "Mar", 16400, products[0].id),
            ("Infrastructure", "Mar", 10400, products[2].id),
            ("Sales", "Mar", 8000, products[1].id),
            ("AI/API", "Mar", 7000, None),
            ("Ops", "Mar", 5100, None),
            ("Engineering", "Apr", 17800, products[0].id),
            ("Infrastructure", "Apr", 11800, products[2].id),
            ("Sales", "Apr", 9200, products[1].id),
            ("AI/API", "Apr", 7600, None),
            ("Ops", "Apr", 5200, None),
            ("Engineering", "May", 18800, products[0].id),
            ("Infrastructure", "May", 12800, products[2].id),
            ("Sales", "May", 9400, products[1].id),
            ("AI/API", "May", 8100, None),
            ("Ops", "May", 5100, None),
            ("Engineering", "Jun", 20200, products[0].id),
            ("Infrastructure", "Jun", 14100, products[2].id),
            ("Sales", "Jun", 10400, products[1].id),
            ("AI/API", "Jun", 8700, None),
            ("Ops", "Jun", 5400, None),
        ]
        db.add_all(
            [
                Expense(category=category, month=month, amount=amount, product_id=product_id)
                for category, month, amount, product_id in expense_rows
            ]
        )

        db.add_all(
            [
                Agent(name="AI CEO", role="Strategy orchestration", current_task="Prioritize Q3 capital allocation across SaaS lines", status="Reviewing", token_cost=184.2, completed_tasks=128, efficiency=94),
                Agent(name="AI CTO", role="Architecture and reliability", current_task="Design local LLM cluster failover policy", status="Running", token_cost=243.7, completed_tasks=211, efficiency=91),
                Agent(name="AI Product Manager", role="Research and roadmap", current_task="Score FarmGrid sensor dashboard requirements", status="Running", token_cost=122.8, completed_tasks=389, efficiency=96),
                Agent(name="AI Engineer", role="Implementation", current_task="Generate CampusGrid billing API tests", status="Running", token_cost=318.6, completed_tasks=542, efficiency=89),
                Agent(name="AI Marketing Agent", role="Campaign systems", current_task="Prepare BuildGrid contractor nurture sequence", status="Idle", token_cost=76.5, completed_tasks=166, efficiency=87),
                Agent(name="AI Sales Agent", role="Pipeline support", current_task="Qualify 43 education ERP leads", status="Running", token_cost=98.1, completed_tasks=274, efficiency=93),
                Agent(name="AI Finance Agent", role="Forecasting and control", current_task="Reconcile cloud spend against product P&L", status="Reviewing", token_cost=64.9, completed_tasks=197, efficiency=92),
                Agent(name="AI Support Agent", role="Customer operations", current_task="Cluster support tickets by product health impact", status="Blocked", token_cost=55.4, completed_tasks=431, efficiency=78),
            ]
        )

        db.add_all(
            [
                InfrastructureMetric(label="Server uptime", value="99.98%", progress=99, status="healthy"),
                InfrastructureMetric(label="Docker containers", value="42 running", progress=88, status="healthy"),
                InfrastructureMetric(label="API usage", value="8.7M req", progress=72, status="healthy"),
                InfrastructureMetric(label="GPU utilization", value="68%", progress=68, status="warning"),
                InfrastructureMetric(label="LLM workloads", value="19 active", progress=76, status="healthy"),
                InfrastructureMetric(label="Storage usage", value="61%", progress=61, status="healthy"),
            ]
        )

        db.add_all(
            [
                Deployment(product_id=products[0].id, service_name="buildgrid-api", version="v2.8.4", environment="production", status="rolled out", notes="Procurement approvals"),
                Deployment(product_id=products[1].id, service_name="campusgrid-worker", version="v1.4.1", environment="staging", status="rebuilt", notes="Billing queue patch"),
                Deployment(product_id=products[2].id, service_name="farmgrid-edge", version="v0.8.6", environment="staging", status="restarted", notes="Telemetry sync"),
                Deployment(product_id=None, service_name="llm-router", version="v0.3.2", environment="production", status="scaled", notes="7 replicas"),
            ]
        )

        db.add_all(
            [
                ProductIdea(title="ClinicGrid", stage="Ideas", market_size="$28B", estimated_revenue="$1.8M ARR", category="Healthcare operations", priority="High", assigned_team="Venture Studio"),
                ProductIdea(title="LegalGrid", stage="Research", market_size="$19B", estimated_revenue="$950K ARR", category="Legal workflow", priority="Medium", assigned_team="AI PM + Sales"),
                ProductIdea(title="LogisticsGrid", stage="Validation", market_size="$44B", estimated_revenue="$2.4M ARR", category="Supply chain", priority="High", assigned_team="CTO Office"),
                ProductIdea(title="BuildGrid Vendor Wallet", stage="MVP", market_size="$7B", estimated_revenue="$620K ARR", category="FinOps add-on", priority="High", assigned_team="BuildGrid Core"),
                ProductIdea(title="CampusGrid AI Registrar", stage="Development", market_size="$5B", estimated_revenue="$410K ARR", category="Education AI", priority="Medium", assigned_team="Education Studio"),
                ProductIdea(title="FarmGrid Soil Intelligence", stage="Testing", market_size="$12B", estimated_revenue="$780K ARR", category="Agri telemetry", priority="Medium", assigned_team="Agriculture Studio"),
                ProductIdea(title="GridSphere Partner Portal", stage="Launch", market_size="$3B", estimated_revenue="$300K ARR", category="Ecosystem", priority="Low", assigned_team="Growth"),
                ProductIdea(title="BuildGrid AI Estimator", stage="Scale", market_size="$11B", estimated_revenue="$1.2M ARR", category="Construction AI", priority="High", assigned_team="AI Workforce"),
            ]
        )

        db.add_all(
            [
                Task(title="Review FarmGrid GPU budget exception", product_id=products[2].id, priority="Critical", status="Open", due_date="2026-05-03"),
                Task(title="Approve BuildGrid vendor wallet release plan", product_id=products[0].id, priority="Critical", status="Open", due_date="2026-05-06"),
                Task(title="Finalize CampusGrid parent portal spec", product_id=products[1].id, priority="High", status="In Progress", due_date="2026-05-10"),
                Task(title="Audit AI agent production deploy permission scopes", priority="Critical", status="Open", due_date="2026-05-02"),
            ]
        )

        db.commit()
        print("Seed completed: GridSphere mock operating data loaded.")

        _seed_pricing_and_crm(db, admin.id)

        # BuildGrid data — needs the BBU client seeded by _seed_pricing_and_crm
        from sqlalchemy import select as _select
        from app.db.models import Client as _Client
        bbu = db.scalar(_select(_Client).where(_Client.tenant_id == "bbu-global-infra"))
        if bbu:
            _seed_buildgrid(db, bbu.id)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
