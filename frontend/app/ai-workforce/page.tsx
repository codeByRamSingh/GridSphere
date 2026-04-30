"use client";

import { useQuery } from "@tanstack/react-query";
import { Bot, CheckCircle2, CircleDollarSign, Gauge, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardApi } from "@/lib/api";
import { agentLogs, agents } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import type { Agent, AgentLog } from "@/types";

const agentStatusTone: Record<Agent["status"], "green" | "cyan" | "amber" | "red"> = {
  Running: "green",
  Reviewing: "cyan",
  Idle: "amber",
  Blocked: "red"
};

export default function AIWorkforcePage() {
  const { data } = useQuery({
    queryKey: ["ai-workforce"],
    queryFn: dashboardApi.agents,
    initialData: { agents, logs: agentLogs }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Workforce"
        title="Agent management system"
        description="Coordinate executive, engineering, product, marketing, sales, finance, and support agents as a future AI company operating layer."
        action={
          <Button>
            <Bot className="h-4 w-4" />
            Assign AI Task
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Agent Activity Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.logs.map((log) => (
              <AgentLogRow key={log.id} log={log} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Guardrails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-400">
            <Guardrail label="Human review required" value="Finance changes, production deploys" />
            <Guardrail label="Max daily API budget" value="$1,250 across all agents" />
            <Guardrail label="Escalation rule" value="Critical customer or infra risk" />
            <Guardrail label="Knowledge refresh" value="Every 6 hours from product docs" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-50">{agent.name}</p>
            <p className="mt-1 text-xs text-slate-500">{agent.role}</p>
          </div>
          <Badge tone={agentStatusTone[agent.status]}>{agent.status}</Badge>
        </div>

        <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current task</p>
          <p className="mt-2 min-h-12 text-sm text-slate-200">{agent.currentTask}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <AgentMetric icon={CircleDollarSign} label="Cost" value={formatCurrency(agent.tokenCost)} />
          <AgentMetric icon={CheckCircle2} label="Done" value={String(agent.completedTasks)} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Efficiency</span>
            <span>{agent.efficiency}%</span>
          </div>
          <Progress
            value={agent.efficiency}
            indicatorClassName={agent.efficiency < 80 ? "bg-amber-300" : "bg-emerald-300"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AgentMetric({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/30 p-3">
      <Icon className="h-4 w-4 text-cyan-200" />
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-100">{value}</p>
    </div>
  );
}

function AgentLogRow({ log }: { log: AgentLog }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-white/10 bg-slate-950/30 p-4">
      <div
        className={cn(
          "mt-1 h-2.5 w-2.5 rounded-full",
          log.severity === "success" && "bg-emerald-300",
          log.severity === "warning" && "bg-amber-300",
          log.severity === "info" && "bg-cyan-300"
        )}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-100">{log.agent}</p>
          <Badge>{log.time}</Badge>
        </div>
        <p className="mt-1 text-sm text-slate-400">{log.event}</p>
      </div>
    </div>
  );
}

function Guardrail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/35 p-3">
      <div className="flex items-center gap-2 text-slate-100">
        <Gauge className="h-4 w-4 text-cyan-200" />
        {label}
      </div>
      <p className="mt-2 text-slate-500">{value}</p>
    </div>
  );
}
