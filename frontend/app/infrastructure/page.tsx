"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Cpu, Server } from "lucide-react";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardApi } from "@/lib/api";
import { clusterHealth, deploymentLogs, infrastructureMetrics } from "@/lib/mock-data";

export default function InfrastructurePage() {
  const { data } = useQuery({
    queryKey: ["infrastructure"],
    queryFn: dashboardApi.infrastructure,
    initialData: { metrics: infrastructureMetrics, clusterHealth, deploymentLogs }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Infrastructure"
        title="Cloud and local LLM cluster control"
        description="Track uptime, containers, API usage, GPU utilization, LLM workloads, storage, deployments, and alerts for future hybrid AI infrastructure."
        action={
          <Button>
            <Server className="h-4 w-4" />
            Deploy Product
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-50">{metric.value}</p>
                </div>
                <Badge tone={metric.status === "warning" ? "amber" : "green"}>{metric.status}</Badge>
              </div>
              <Progress
                value={metric.progress}
                indicatorClassName={metric.status === "warning" ? "bg-amber-300" : "bg-cyan-300"}
              />
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel title="Cluster Health" description="Composite health score across API, workers, database, queues, and inference nodes.">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.clusterHealth}>
                  <defs>
                    <linearGradient id="clusterHealth" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Area type="monotone" dataKey="value" stroke="#34d399" fill="url(#clusterHealth)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.deploymentLogs.map((log) => (
              <div key={log} className="flex gap-3 rounded-md border border-white/10 bg-slate-950/35 p-3 text-sm text-slate-300">
                <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                {log}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Alert Notifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <AlertItem title="GPU queue pressure" description="Inference workloads exceeded 70% for 18 minutes." />
          <AlertItem title="Storage forecast" description="Primary object bucket reaches 80% in 26 days." />
          <AlertItem title="Replica lag recovered" description="PostgreSQL read replica returned under 50ms lag." />
        </CardContent>
      </Card>
    </div>
  );
}

function AlertItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-amber-300/20 bg-amber-300/5 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-amber-100">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
