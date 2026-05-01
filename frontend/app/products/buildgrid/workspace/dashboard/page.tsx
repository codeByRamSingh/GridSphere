"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Banknote,
  Building2,
  ClipboardList,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { buildgridApi } from "@/lib/api";
import { bgProjects, bgPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { BGProject, BGPurchaseOrder } from "@/types";

const BG_STATUS_CLASS: Record<string, string> = {
  planning:  "bg-slate-800 text-slate-400",
  active:    "bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500/30",
  completed: "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  on_hold:   "bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/30",
};

const PO_STATUS_CLASS: Record<string, string> = {
  draft:     "bg-slate-800 text-slate-400",
  sent:      "bg-blue-900/50 text-blue-300 ring-1 ring-blue-500/30",
  approved:  "bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500/30",
  fulfilled: "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  cancelled: "bg-red-900/50 text-red-400 ring-1 ring-red-500/30",
};

function Dashboard() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id") ?? undefined;

  const tenantProjects    = bgProjects.filter((p) => !tenantId || p.tenantId === tenantId);
  const tenantOrders      = bgPurchaseOrders.filter((o) => {
    if (!tenantId) return true;
    const proj = bgProjects.find((p) => p.id === o.projectId);
    return proj?.tenantId === tenantId;
  });

  const { data: projects = tenantProjects } = useQuery<BGProject[]>({
    queryKey: ["bg-projects", tenantId],
    queryFn:  () => buildgridApi.projects(tenantId),
    initialData: tenantProjects,
  });

  const { data: purchaseOrders = tenantOrders } = useQuery<BGPurchaseOrder[]>({
    queryKey: ["bg-purchase-orders", tenantId],
    queryFn:  () => buildgridApi.purchaseOrders(),
    initialData: tenantOrders,
  });

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalBudget    = projects.reduce((s, p) => s + p.totalBudget, 0);
  const totalSpent     = projects.reduce((s, p) => s + p.spentToDate, 0);
  const pendingOrders  = purchaseOrders.filter((o) => o.status === "draft" || o.status === "sent").length;
  const pendingValue   = purchaseOrders
    .filter((o) => o.status === "draft" || o.status === "sent")
    .reduce((s, o) => s + o.amount, 0);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const recentOrders = [...purchaseOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · Dashboard"
        title="Project Control Centre"
        description="Live view of active construction projects, procurement pipeline, and budget utilisation."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={<Building2 className="h-5 w-5" />}  label="Active Projects"  value={String(activeProjects)}          sub={`${projects.length} total`}                 />
        <KPICard icon={<Banknote className="h-5 w-5" />}   label="Total Budget"      value={formatCurrency(totalBudget)}     sub="across all projects"                        />
        <KPICard icon={<TrendingUp className="h-5 w-5" />} label="Budget Utilised"   value={formatCurrency(totalSpent)}      sub={`${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% of total`} />
        <KPICard icon={<ShoppingCart className="h-5 w-5" />} label="Pending Orders"  value={String(pendingOrders)}          sub={`${formatCurrency(pendingValue)} value`}     />
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4 text-sm font-medium text-slate-100">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              Recent Projects
            </div>
            <div className="divide-y divide-white/5">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-200">{p.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{p.location}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${BG_STATUS_CLASS[p.status]}`}>
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-500">{p.completionPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4 text-sm font-medium text-slate-100">
              <Activity className="h-4 w-4 text-slate-400" />
              Procurement Activity
            </div>
            <div className="divide-y divide-white/5">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-200">{o.vendorName}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{o.description}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PO_STATUS_CLASS[o.status]}`}>
                      {o.status}
                    </span>
                    <span className="text-xs font-medium text-slate-300">{formatCurrency(o.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{label}</p>
          <span className="text-slate-600">{icon}</span>
        </div>
        <p className="mt-3 text-2xl font-semibold text-slate-50">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function BuildGridWorkspaceDashboard() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
