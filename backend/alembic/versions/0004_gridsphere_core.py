"""GridSphere Core: AgentRun, SystemEvent, TenantConfig

Revision ID: 0004_gridsphere_core
Revises: 0003_buildgrid
Create Date: 2026-04-30
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004_gridsphere_core"
down_revision: str | None = "0003_buildgrid"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "agent_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("agent_type", sa.String(length=100), nullable=False),
        sa.Column("trigger_event", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="running"),
        sa.Column("input_payload", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("output_payload", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("decision_log", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("duration_ms", sa.Integer(), nullable=True),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column("tenant_id", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_agent_runs_agent_type", "agent_runs", ["agent_type"])
    op.create_index("ix_agent_runs_tenant_id", "agent_runs", ["tenant_id"])

    op.create_table(
        "system_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("event_name", sa.String(length=100), nullable=False),
        sa.Column("payload", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("processed", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("tenant_id", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_system_events_event_name", "system_events", ["event_name"])
    op.create_index("ix_system_events_tenant_id", "system_events", ["tenant_id"])

    op.create_table(
        "tenant_configs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tenant_id", sa.String(length=120), nullable=False, unique=True),
        sa.Column("config", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("storage_bucket", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("db_schema", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("provisioned_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("provisioned_by", sa.String(length=100), nullable=False, server_default="manual"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_tenant_configs_tenant_id", "tenant_configs", ["tenant_id"])


def downgrade() -> None:
    op.drop_table("tenant_configs")
    op.drop_table("system_events")
    op.drop_table("agent_runs")
