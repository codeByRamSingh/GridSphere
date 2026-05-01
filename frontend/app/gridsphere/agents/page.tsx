"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { aiAgentsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { AgentRunSummary } from "@/types";

const AGENT_TYPES = ["SalesAgent", "DeploymentAgent", "SupportAgent"];

const AGENT_COLOR: Record<string, { text: string; bg: string }> = {
  SalesAgent:      { text: "text-violet-300", bg: "bg-violet-400/10" },
  DeploymentAgent: { text: "text-cyan-300",   bg: "bg-cyan-400/10"   },
  SupportAgent:    { text: "text-amber-300",  bg: "bg-amber-400/10"  },
};

const STATUS_CONFIG = {
  completed: { icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, label: "Completed", cls: "text-emerald-400" },
  running:   { icon: <CircleDot    className="h-4 w-4 text-cyan-400 animate-pulse" />, label: "Running", cls: "text-cyan-400" },
  failed:    { icon: <XCircle      className="h-4 w-4 text-red-400" />, label: "Failed", cls: "text-red-400" },
};

export default function AgentsMonitorPage() {
  const [filterAgent, setFilterAgent] = useState<string>("");

  const { data: runs = [], isLoading, refetch, isFetching } = useQuery<AgentRunSummary[]>({
    queryKey: ["agent-runs", filterAgent],
    queryFn: () => aiAgentsApi.runs({ agentType: filterAgent || undefined, limit: 100 }),
    refetchInterval: 20_000,
  });

  const completed = runs.filter((r) => r.status === "completed").length;
  const failed    = runs.filter((r) => r.status === "failed").length;
  const running   = runs.filter((r) => r.status === "running").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="GridSphere · Agents"
          title="Agent Activity Monitor"
          description="Live history of all AI agent executions — decisions, outcomes, and tenant context."
        />
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-1 flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-400 transition-colors hover:text-slate-200 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatPill label="Completed" value={completed} cls="text-emerald-300" />
        <StatPill label="Running"   value={running}   cls="text-cyan-300 animate-pulse" />
        <StatPill label="Failed"    value={failed}    cls="text-red-400" />
      </div>

      {/* Agent type filter */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={!filterAgent} onClick={() => setFilterAgent("")}>All agents</FilterButton>
        {AGENT_TYPES.map((t) => (
          <FilterButton key={t} active={filterAgent === t} onClick={() => setFilterAgent(t)}>
            {t}
          </FilterButton>
        ))}
      </div>

      {/* Run list */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4 text-sm font-medium text-slate-100">
            <Bot className="h-4 w-4 text-slate-400" />
            {filterAgent || "All"} runs
            <span className="ml-auto text-xs text-slate-600">{runs.length} records</span>
          </div>
          {isLoading ? (
            <p className="py-12 text-center animate-pulse text-sm text-slate-500">Loading…</p>
          ) : runs.length === 0 ? (
            <div className="py-12 text-center">
              <Bot className="mx-auto mb-3 h-8 w-8 text-slate-700" />
              <p className="text-sm text-slate-500">No agent runs yet.</p>
              <p className="mt-1 text-xs text-slate-600">Dispatch an agent from the Command Centre or via API.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {runs.map((run) => (
                <RunRow key={run.id} run={run} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatPill({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={cn("text-xl font-semibold", cls)}>{value}</p>
      </CardContent>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
          : "border-white/10 bg-slate-900 text-slate-400 hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function RunRow({ run }: { run: AgentRunSummary }) {
  const [expanded, setExpanded] = useState(false);
  const colors = AGENT_COLOR[run.agentType] ?? { text: "text-slate-300", bg: "bg-slate-800" };
  const statusCfg = STATUS_CONFIG[run.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.running;

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-900/50"
      >
        {statusCfg.icon}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium capitalize", colors.bg, colors.text)}>
              {run.agentType}
            </span>
            <span className="text-xs text-slate-500">{run.triggerEvent}</span>
          </div>
          {run.tenantId && (
            <p className="mt-0.5 truncate text-xs text-slate-600">{run.tenantId}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          {run.durationMs != null && (
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {run.durationMs} ms
            </p>
          )}
          <p className="mt-0.5 text-xs text-slate-600">
            {run.createdAt ? new Date(run.createdAt).toLocaleString() : "—"}
          </p>
        </div>
        <ChevronDown className={cn("ml-2 h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="border-t border-white/5 bg-slate-950/50 px-5 py-3">
          <p className="mb-2 text-xs font-medium text-slate-400">Run ID #{run.id}</p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>Status: <span className={statusCfg.cls}>{run.status}</span></span>
            {run.tenantId && <span>Tenant: {run.tenantId}</span>}
            {run.durationMs != null && <span>Duration: {run.durationMs} ms</span>}
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Open <code className="text-slate-400">GET /api/v1/ai-agents/runs/{run.id}</code> for full decision log.
          </p>
        </div>
      )}
    </div>
  );
}
