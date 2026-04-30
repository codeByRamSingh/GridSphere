"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ChartNoAxesCombined, UsersRound } from "lucide-react";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardApi } from "@/lib/api";
import { acquisition, churn, funnel, geography, products } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const geoColors = ["#67e8f9", "#a78bfa", "#34d399", "#fbbf24", "#94a3b8"];

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: dashboardApi.analytics,
    initialData: {
      acquisition,
      churn,
      funnel,
      geography,
      adoption: products.map((product) => ({
        name: product.name,
        value: product.health
      }))
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Growth intelligence and adoption telemetry"
        description="Analyze acquisition, churn, conversion funnel, geographic distribution, and product adoption across the GridSphere portfolio."
        action={
          <Button>
            <ChartNoAxesCombined className="h-4 w-4" />
            Build Segment
          </Button>
        }
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="User Acquisition" description="Total customer growth by month.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.acquisition}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Line type="monotone" dataKey="customers" stroke="#67e8f9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Churn Chart" description="Monthly customer churn rate trending down.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.churn}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartPanel title="Conversion Funnel" description="Visitor to paid customer flow.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} layout="vertical">
                <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={72} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Bar dataKey="value" fill="#a78bfa" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Geographic Distribution" description="Customer base by region.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Pie data={data.geography} dataKey="value" nameKey="name" outerRadius={94}>
                  {data.geography.map((entry, index) => (
                    <Cell key={entry.name} fill={geoColors[index % geoColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <Card>
          <CardHeader>
            <CardTitle>Product Adoption Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.adoption.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-200">
                    <UsersRound className="h-4 w-4 text-cyan-200" />
                    {item.name}
                  </div>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Funnel Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {data.funnel.map((item) => (
            <div key={item.name} className="rounded-md border border-white/10 bg-slate-950/35 p-4">
              <p className="text-sm text-slate-400">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">{formatNumber(item.value)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
