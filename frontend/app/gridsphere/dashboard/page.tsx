"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Bot,
  Building2,
  CheckCircle2,
  CircleDot,
  DollarSign,
  Package,
  TrendingUp,
  Users2,
  XCircle,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { gridsphereApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AgentRunSummary, CommandCentreOverview } from "@/types";

const AGENT_COLORS: Record<string, string> = {
  SalesAgent:      "text-violet-300",
  DeploymentAgent: "text-cyan-300",
  SupportAgent:    "text-amber-300",
};

const STATUS_ICON = {
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  running:   <CircleDot    className="h-4 w-4 text-cyan-400 animate-pulse" />,
  failed:    <XCircle      className="h-4 w-4 text-red-400" />,
};

const PRODUCT_PILL: Record<string, string> = {
  buildgrid:  "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-500/20",
  campusgrid: "bg-violet-400/10 text-violet-300 ring-1 ring-violet-500/20",
  farmgrid:   "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-500/20",
  medigrid:   "bg-rose-400/10 text-rose-300 ring-1 ring-rose-500/20",
};

export default function CommandCentreDashboard() {
  const { data: overview, isLoading } = useQuery<CommandCentreOverview>({
    queryKey: ["gridsphere-overview"],
    queryFn: gridsphereApi.overview,
    refetchInterval: 30_000,
  });

  if (isLoading || !overview) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-sm text-slate-500">Loading Command Centre…</p>
      </div>
    );
  }

  const healthPct =
    overview.agentRuns24h > 0
      ? Math.round(((overview.agentRuns24h - overview.agentFailures24h) / overview.agentRuns24h) * 100)
      : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="GridSphere · Command Centre"
        title="Operating System Dashboard"
        description="Real-time view of all tenants, AI agent activity, deployments, and revenue across every Grid product."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={<Users2 className="h-5 w-5" />}
          label="Total Tenants"
          value={String(overview.totalTenants)}
          sub={`${overview.activeTenants} active`}
          tone="cyan"
        />
        <KPICard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total ARR"
          value={formatCurrency(overview.totalArr)}
          sub="across active clients"
          tone="green"
        />
        <KPICard
          icon={<Bot className="h-5 w-5" />}
          label="Agent Runs (24 h)"
          value={String(overview.agentRuns24h)}
          sub={`${overview.agentFailures24h} failures`}
          tone={overview.agentFailures24h > 0 ? "amber" : "slate"}
        />
        <KPICard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Agent Health"
          value={`${healthPct}%`}
          sub="success rate"
          tone={healthPct >= 90 ? "green" : healthPct >= 70 ? "amber" : "red"}
        />
      </div>

      {/* Product distribution + recent agent runs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product distribution */}
        <Card>
          <CardContent className="p-0">
            <SectionHeader icon={<Package className="h-4 w-4" />} title="Active Products by Tenant" />
            <div className="divide-y divide-white/5 px-5 pb-3">
              {Object.entries(overview.productDistribution).length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-600">No provisioned products yet</p>
              ) : (
                Object.entries(overview.productDistribution).map(([slug, count]) => (
                  <div key={slug} className="flex items-center justify-between py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", PRODUCT_PILL[slug] ?? "bg-slate-800 text-slate-300")}>
                      {slug}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">{count} tenant{count !== 1 ? "s" : ""}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent agent runs */}
        <Card>
          <CardContent className="p-0">
            <SectionHeader icon={<Activity className="h-4 w-4" />} title="Recent Agent Runs" />
            {overview.recentAgentRuns.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-600">No agent runs yet — dispatch an agent to start</p>
            ) : (
              <div className="divide-y divide-white/5">
                {overview.recentAgentRuns.map((run) => (
                  <AgentRunRow key={run.id} run={run} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent system events */}
      {overview.recentEvents.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <SectionHeader icon={<Zap className="h-4 w-4" />} title="System Events" />
            <div className="divide-y divide-white/5">
              {overview.recentEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="shrink-0 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-400">
                    {ev.eventName}
                  </span>
                  {ev.tenantId && (
                    <span className="text-xs text-slate-500 truncate">{ev.tenantId}</span>
                  )}
                  <span className="ml-auto shrink-0 text-xs text-slate-600">
                    {ev.createdAt ? new Date(ev.createdAt).toLocaleTimeString() : "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KPICard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "cyan" | "green" | "amber" | "red" | "slate";
}) {
  const toneClass = {
    cyan:  "text-cyan-300",
    green: "text-emerald-300",
    amber: "text-amber-300",
    red:   "text-red-400",
    slate: "text-slate-400",
  }[tone];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{label}</p>
          <span className={cn("h-5 w-5", toneClass)}>{icon}</span>
        </div>
        <p className="mt-3 text-2xl font-semibold text-slate-50">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{sub}</p>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4 text-sm font-medium text-slate-100">
      <span className="text-slate-400">{icon}</span>
      {title}
    </div>
  );
}

function AgentRunRow({ run }: { run: AgentRunSummary }) {
  const agentColor = AGENT_COLORS[run.agentType] ?? "text-slate-300";
  const icon = STATUS_ICON[run.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.running;

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      {icon}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", agentColor)}>{run.agentType}</p>
        {run.tenantId && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{run.tenantId}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        {run.durationMs != null && (
          <p className="text-xs text-slate-500">{run.durationMs} ms</p>
        )}
        <p className="text-xs text-slate-600">
          {run.createdAt ? new Date(run.createdAt).toLocaleTimeString() : "—"}
        </p>
      </div>
    </div>
  );
}
