"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";
import {
  activities,
  executiveKpis,
  monthlyExpenses,
  productGrowth,
  quickActions,
  revenueGrowth
} from "@/lib/mock-data";
import { Download } from "lucide-react";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["executive-dashboard"],
    queryFn: dashboardApi.executive,
    initialData: {
      kpis: executiveKpis,
      revenueGrowth,
      productGrowth,
      monthlyExpenses,
      activities,
      quickActions
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Command Centre"
        description="Monitor revenue, customers, product health, AI workforce output, infrastructure posture, and the critical work that needs human attention."
        action={
          <Button>
            <Download className="h-4 w-4" />
            Export Brief
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel title="Revenue Growth" description="MRR and customer base expansion across the operating system.">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueGrowth}>
                  <defs>
                    <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#67e8f9" fill="url(#revenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>

        <ChartPanel title="Monthly Expenses" description="Operating cost trend by month.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyExpenses}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartPanel title="Product Growth" description="Monthly MRR contribution by active SaaS product.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.productGrowth}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Line type="monotone" dataKey="buildGrid" stroke="#67e8f9" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="campusGrid" stroke="#a78bfa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="farmGrid" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ActivityFeed activities={data.activities} />
        <QuickActions actions={data.quickActions} />
      </section>
    </div>
  );
}
