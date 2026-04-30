"""CRM and Pricing schema

Revision ID: 0002_crm_pricing_schema
Revises: 0001_initial_schema
Create Date: 2026-04-30
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002_crm_pricing_schema"
down_revision: str | None = "0001_initial_schema"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "plans",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=50), nullable=False, unique=True),
        sa.Column("price_monthly", sa.Float(), nullable=False, server_default="0"),
        sa.Column("price_annual", sa.Float(), nullable=False, server_default="0"),
        sa.Column("max_seats", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("max_products", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("features", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "clients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("organization", sa.String(length=255), nullable=False),
        sa.Column("contact_person", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=False, server_default=""),
        sa.Column("industry", sa.String(length=100), nullable=False),
        sa.Column("tenant_id", sa.String(length=120), nullable=False),
        sa.Column("plan_id", sa.Integer(), sa.ForeignKey("plans.id"), nullable=True),
        sa.Column("region", sa.String(length=100), nullable=False, server_default=""),
        sa.Column("deal_value", sa.Float(), nullable=False, server_default="0"),
        sa.Column("portal_enabled", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("onboarding_status", sa.String(length=50), nullable=False, server_default="draft"),
        sa.Column("account_manager_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("tags", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_clients_tenant_id", "clients", ["tenant_id"], unique=True)
    op.create_index("ix_clients_plan_id", "clients", ["plan_id"])
    op.create_index("ix_clients_account_manager_id", "clients", ["account_manager_id"])

    op.create_table(
        "client_products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("client_id", sa.Integer(), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("product_slug", sa.String(length=120), nullable=False),
        sa.Column("provisioned", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("enabled_modules", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_client_products_client_id", "client_products", ["client_id"])

    op.create_table(
        "client_users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("client_id", sa.Integer(), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("invited", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("accepted", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_client_users_client_id", "client_users", ["client_id"])
    op.create_index("ix_client_users_user_id", "client_users", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_client_users_user_id", table_name="client_users")
    op.drop_index("ix_client_users_client_id", table_name="client_users")
    op.drop_table("client_users")
    op.drop_index("ix_client_products_client_id", table_name="client_products")
    op.drop_table("client_products")
    op.drop_index("ix_clients_account_manager_id", table_name="clients")
    op.drop_index("ix_clients_plan_id", table_name="clients")
    op.drop_index("ix_clients_tenant_id", table_name="clients")
    op.drop_table("clients")
    op.drop_table("plans")
