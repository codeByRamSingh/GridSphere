"use client";

import {
  Area,
  AreaChart,
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
import { BadgeDollarSign, FileText } from "lucide-react";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardApi } from "@/lib/api";
import { expensesBreakdown, financeSeries, profitability } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const pieColors = ["#67e8f9", "#a78bfa", "#34d399", "#fbbf24", "#94a3b8"];

export default function FinancePage() {
  const { data } = useQuery({
    queryKey: ["finance"],
    queryFn: dashboardApi.finance,
    initialData: { financeSeries, expensesBreakdown, profitability }
  });

  const latest = data.financeSeries[data.financeSeries.length - 1];
  const cashRunwayMonths = 18.4;
  const burnRate = latest.expenses ?? 0;
  const arr = (latest.revenue ?? 0) * 12;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Revenue, burn, runway, and product profitability"
        description="Understand the parent company P&L across MRR, ARR, expenses, cash runway, burn rate, and product-wise contribution."
        action={
          <Button>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FinanceStat label="MRR" value={formatCurrency(latest.revenue ?? 0)} />
        <FinanceStat label="ARR" value={formatCurrency(arr)} />
        <FinanceStat label="Burn rate" value={formatCurrency(burnRate)} />
        <FinanceStat label="Cash runway" value={`${cashRunwayMonths} months`} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="MRR Chart" description="Monthly recurring revenue growth.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.financeSeries}>
                <defs>
                  <linearGradient id="financeRevenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#67e8f9" fill="url(#financeRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="ARR Chart" description="Annualized recurring revenue trend.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.financeSeries.map((item) => ({ ...item, arr: (item.revenue ?? 0) * 12 }))}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Line type="monotone" dataKey="arr" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartPanel title="Expenses Breakdown" description="Operating expense allocation.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                <Pie data={data.expensesBreakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92}>
                  {data.expensesBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <div className="xl:col-span-2">
          <ChartPanel title="Product-wise Profitability" description="Revenue and expenses by SaaS product.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.profitability}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Bar dataKey="revenue" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>
      </section>
    </div>
  );
}

function FinanceStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <BadgeDollarSign className="h-4 w-4 text-cyan-200" />
        <p className="mt-4 text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      </CardContent>
    </Card>
  );
}
