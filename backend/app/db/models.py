from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
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
