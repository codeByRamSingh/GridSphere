"""BuildGrid module schema

Revision ID: 0003_buildgrid
Revises: 0002_crm_pricing_schema
Create Date: 2026-04-30
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003_buildgrid"
down_revision: str | None = "0002_crm_pricing_schema"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "bg_projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tenant_id", sa.String(length=120), nullable=False),
        sa.Column("client_id", sa.Integer(), sa.ForeignKey("clients.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="planning"),
        sa.Column("start_date", sa.String(length=20), nullable=False, server_default=""),
        sa.Column("end_date", sa.String(length=20), nullable=True),
        sa.Column("total_budget", sa.Float(), nullable=False, server_default="0"),
        sa.Column("spent_to_date", sa.Float(), nullable=False, server_default="0"),
        sa.Column("completion_pct", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_bg_projects_tenant_id", "bg_projects", ["tenant_id"])
    op.create_index("ix_bg_projects_client_id", "bg_projects", ["client_id"])

    op.create_table(
        "bg_boq_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("bg_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_name", sa.String(length=255), nullable=False),
        sa.Column("unit", sa.String(length=50), nullable=False, server_default="unit"),
        sa.Column("quantity", sa.Float(), nullable=False, server_default="0"),
        sa.Column("unit_cost", sa.Float(), nullable=False, server_default="0"),
        sa.Column("total_cost", sa.Float(), nullable=False, server_default="0"),
        sa.Column("category", sa.String(length=100), nullable=False, server_default=""),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_bg_boq_items_project_id", "bg_boq_items", ["project_id"])

    op.create_table(
        "bg_vendors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tenant_id", sa.String(length=120), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("contact", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("email", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("category", sa.String(length=100), nullable=False, server_default=""),
        sa.Column("rating", sa.Float(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_bg_vendors_tenant_id", "bg_vendors", ["tenant_id"])

    op.create_table(
        "bg_purchase_orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("bg_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("vendor_id", sa.Integer(), sa.ForeignKey("bg_vendors.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="draft"),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_bg_purchase_orders_project_id", "bg_purchase_orders", ["project_id"])
    op.create_index("ix_bg_purchase_orders_vendor_id", "bg_purchase_orders", ["vendor_id"])

    op.create_table(
        "bg_expenses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("bg_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("date", sa.String(length=20), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_bg_expenses_project_id", "bg_expenses", ["project_id"])


def downgrade() -> None:
    op.drop_table("bg_expenses")
    op.drop_table("bg_purchase_orders")
    op.drop_table("bg_vendors")
    op.drop_table("bg_boq_items")
    op.drop_table("bg_projects")
