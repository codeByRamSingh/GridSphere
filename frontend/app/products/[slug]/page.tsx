"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bug, Rocket, Users } from "lucide-react";
import Link from "next/link";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/ui/status-pill";
import { dashboardApi } from "@/lib/api";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: product } = useQuery({
    queryKey: ["product", params.slug],
    queryFn: () => dashboardApi.product(params.slug)
  });

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={product.market}
        title={product.name}
        description={product.description}
        action={
          <Button variant="outline" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <ProductStat label="MRR" value={formatCurrency(product.revenue)} icon={Rocket} />
        <ProductStat label="Active users" value={formatNumber(product.activeUsers)} icon={Users} />
        <ProductStat label="Growth" value={formatPercent(product.growth)} icon={Rocket} />
        <ProductStat label="Open bugs" value={String(product.openBugs)} icon={Bug} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel title="MRR Trend" description={`${product.name} monthly recurring revenue.`}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={product.mrrSeries}>
                  <defs>
                    <linearGradient id="productRevenue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#67e8f9" fill="url(#productRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operating Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Deployment</span>
              <StatusPill status={product.deploymentStatus} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Product health</span>
                <span className="text-slate-100">{product.health}%</span>
              </div>
              <Progress value={product.health} />
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Owner</p>
              <p className="mt-2 text-sm text-slate-100">{product.owner}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next milestone</p>
              <p className="mt-2 text-sm text-slate-100">{product.nextMilestone}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <ChartPanel title="Feature Adoption" description="Adoption score by operating module.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={product.adoption}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
              <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>
    </div>
  );
}

function ProductStat({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="h-4 w-4 text-cyan-200" />
        <p className="mt-4 text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      </CardContent>
    </Card>
  );
}
