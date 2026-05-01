from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.base import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="admin", nullable=False)


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    market: Mapped[str] = mapped_column(String(160), nullable=False)
    stage: Mapped[str] = mapped_column(String(50), nullable=False)
    revenue_monthly: Mapped[float] = mapped_column(Float, default=0)
    active_users: Mapped[int] = mapped_column(Integer, default=0)
    growth_rate: Mapped[float] = mapped_column(Float, default=0)
    open_bugs: Mapped[int] = mapped_column(Integer, default=0)
    deployment_status: Mapped[str] = mapped_column(String(50), default="building")
    health: Mapped[int] = mapped_column(Integer, default=80)
    owner: Mapped[str] = mapped_column(String(160), nullable=False)
    next_milestone: Mapped[str] = mapped_column(String(255), nullable=False)

    revenues: Mapped[list["Revenue"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    customers: Mapped[list["Customer"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    expenses: Mapped[list["Expense"]] = relationship(back_populates="product")
    deployments: Mapped[list["Deployment"]] = relationship(back_populates="product")
    tasks: Mapped[list["Task"]] = relationship(back_populates="product")


class Revenue(TimestampMixin, Base):
    __tablename__ = "revenues"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    month: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)

    product: Mapped[Product] = relationship(back_populates="revenues")


class Customer(TimestampMixin, Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    segment: Mapped[str] = mapped_column(String(100), nullable=False)
    seats: Mapped[int] = mapped_column(Integer, default=1)
    mrr: Mapped[float] = mapped_column(Float, default=0)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active")

    product: Mapped[Product] = relationship(back_populates="customers")


class Expense(TimestampMixin, Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True, index=True)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    month: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)

    product: Mapped[Product | None] = relationship(back_populates="expenses")


class Agent(TimestampMixin, Base):
    __tablename__ = "agents"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(180), nullable=False)
    current_task: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    token_cost: Mapped[float] = mapped_column(Float, default=0)
    completed_tasks: Mapped[int] = mapped_column(Integer, default=0)
    efficiency: Mapped[int] = mapped_column(Integer, default=0)

    tasks: Mapped[list["Task"]] = relationship(back_populates="agent")


class Task(TimestampMixin, Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True, index=True)
    agent_id: Mapped[int | None] = mapped_column(ForeignKey("agents.id"), nullable=True, index=True)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    due_date: Mapped[str | None] = mapped_column(String(50), nullable=True)

    product: Mapped[Product | None] = relationship(back_populates="tasks")
    agent: Mapped[Agent | None] = relationship(back_populates="tasks")


class Deployment(TimestampMixin, Base):
    __tablename__ = "deployments"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True, index=True)
    service_name: Mapped[str] = mapped_column(String(160), nullable=False)
    version: Mapped[str] = mapped_column(String(80), nullable=False)
    environment: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[str] = mapped_column(String(80), nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="")

    product: Mapped[Product | None] = relationship(back_populates="deployments")


class InfrastructureMetric(TimestampMixin, Base):
    __tablename__ = "infrastructure_metrics"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(160), nullable=False)
    value: Mapped[str] = mapped_column(String(80), nullable=False)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), nullable=False)


class ProductIdea(TimestampMixin, Base):
    __tablename__ = "product_ideas"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    stage: Mapped[str] = mapped_column(String(80), nullable=False)
    market_size: Mapped[str] = mapped_column(String(80), nullable=False)
    estimated_revenue: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)
    assigned_team: Mapped[str] = mapped_column(String(160), nullable=False)


# ── Pricing & CRM ────────────────────────────────────────────────────────────

class Plan(TimestampMixin, Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    price_monthly: Mapped[float] = mapped_column(Float, default=0)
    price_annual: Mapped[float] = mapped_column(Float, default=0)
    max_seats: Mapped[int] = mapped_column(Integer, default=0)
    max_products: Mapped[int] = mapped_column(Integer, default=1)
    features: Mapped[str] = mapped_column(Text, default="[]")

    clients: Mapped[list["Client"]] = relationship(back_populates="plan")


class Client(TimestampMixin, Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(255), default="")
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), default="")
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    tenant_id: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    plan_id: Mapped[int | None] = mapped_column(ForeignKey("plans.id"), nullable=True, index=True)
    region: Mapped[str] = mapped_column(String(100), default="")
    deal_value: Mapped[float] = mapped_column(Float, default=0)
    portal_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    onboarding_status: Mapped[str] = mapped_column(String(50), default="draft")
    account_manager_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    tags: Mapped[str] = mapped_column(String(500), default="")

    plan: Mapped["Plan | None"] = relationship(back_populates="clients")
    products: Mapped[list["ClientProduct"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    users: Mapped[list["ClientUser"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    account_manager: Mapped["User | None"] = relationship(foreign_keys=[account_manager_id])


class ClientProduct(TimestampMixin, Base):
    __tablename__ = "client_products"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"), index=True, nullable=False)
    product_slug: Mapped[str] = mapped_column(String(120), nullable=False)
    provisioned: Mapped[bool] = mapped_column(Boolean, default=False)
    enabled_modules: Mapped[str] = mapped_column(Text, default="[]")

    client: Mapped["Client"] = relationship(back_populates="products")


class ClientUser(TimestampMixin, Base):
    __tablename__ = "client_users"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"), index=True, nullable=False)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    invited: Mapped[bool] = mapped_column(Boolean, default=False)
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)

    client: Mapped["Client"] = relationship(back_populates="users")
    user: Mapped["User | None"] = relationship(foreign_keys=[user_id])


# ── BuildGrid ──────────────────────────────────────────────────────────────────

class BGProject(TimestampMixin, Base):
    __tablename__ = "bg_projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    client_id: Mapped[int | None] = mapped_column(ForeignKey("clients.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), default="")
    status: Mapped[str] = mapped_column(String(50), default="planning")
    start_date: Mapped[str] = mapped_column(String(20), default="")
    end_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    total_budget: Mapped[float] = mapped_column(Float, default=0)
    spent_to_date: Mapped[float] = mapped_column(Float, default=0)
    completion_pct: Mapped[int] = mapped_column(Integer, default=0)

    client: Mapped["Client | None"] = relationship(foreign_keys=[client_id])
    boq_items: Mapped[list["BGBOQItem"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    purchase_orders: Mapped[list["BGPurchaseOrder"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    expenses: Mapped[list["BGExpense"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )


class BGBOQItem(TimestampMixin, Base):
    __tablename__ = "bg_boq_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("bg_projects.id"), index=True, nullable=False)
    item_name: Mapped[str] = mapped_column(String(255), nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="unit")
    quantity: Mapped[float] = mapped_column(Float, default=0)
    unit_cost: Mapped[float] = mapped_column(Float, default=0)
    total_cost: Mapped[float] = mapped_column(Float, default=0)
    category: Mapped[str] = mapped_column(String(100), default="")
    notes: Mapped[str] = mapped_column(Text, default="")

    project: Mapped["BGProject"] = relationship(back_populates="boq_items")


class BGVendor(TimestampMixin, Base):
    __tablename__ = "bg_vendors"

    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact: Mapped[str] = mapped_column(String(255), default="")
    email: Mapped[str] = mapped_column(String(255), default="")
    category: Mapped[str] = mapped_column(String(100), default="")
    rating: Mapped[float] = mapped_column(Float, default=0)

    purchase_orders: Mapped[list["BGPurchaseOrder"]] = relationship(back_populates="vendor")


class BGPurchaseOrder(TimestampMixin, Base):
    __tablename__ = "bg_purchase_orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("bg_projects.id"), index=True, nullable=False)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("bg_vendors.id"), index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    description: Mapped[str] = mapped_column(Text, default="")

    project: Mapped["BGProject"] = relationship(back_populates="purchase_orders")
    vendor: Mapped["BGVendor"] = relationship(back_populates="purchase_orders")


class BGExpense(TimestampMixin, Base):
    __tablename__ = "bg_expenses"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("bg_projects.id"), index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    date: Mapped[str] = mapped_column(String(20), default="")

    project: Mapped["BGProject"] = relationship(back_populates="expenses")


# ── GridSphere Core ────────────────────────────────────────────────────────────

class AgentRun(TimestampMixin, Base):
    """Persistent log of every AI agent execution."""
    __tablename__ = "agent_runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    agent_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    trigger_event: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="running")
    input_payload: Mapped[str] = mapped_column(Text, default="{}")
    output_payload: Mapped[str] = mapped_column(Text, default="{}")
    decision_log: Mapped[str] = mapped_column(Text, default="[]")
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    tenant_id: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)


class SystemEvent(TimestampMixin, Base):
    """Event bus persistence — every published event is stored here."""
    __tablename__ = "system_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    payload: Mapped[str] = mapped_column(Text, default="{}")
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
    tenant_id: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)


class TenantConfig(TimestampMixin, Base):
    """Per-tenant infrastructure configuration created by DeploymentAgent."""
    __tablename__ = "tenant_configs"

    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    config: Mapped[str] = mapped_column(Text, default="{}")
    storage_bucket: Mapped[str] = mapped_column(String(255), default="")
    db_schema: Mapped[str] = mapped_column(String(120), default="")
    provisioned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    provisioned_by: Mapped[str] = mapped_column(String(100), default="manual")
