"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Building2,
  ExternalLink,
  HardHat,
  TrendingUp,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { crmApi, dashboardApi } from "@/lib/api";
import { clients as mockClients, products as mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { getWorkspaceUrl } from "@/lib/product-registry";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { Client, Product } from "@/types";

const CLIENT_STATUS_CLASS: Record<string, string> = {
  active:       "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  provisioning: "bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/30",
  suspended:    "bg-orange-900/50 text-orange-300 ring-1 ring-orange-500/30",
  churned:      "bg-red-900/50 text-red-400 ring-1 ring-red-500/30",
  draft:        "bg-slate-800 text-slate-400",
};

export default function BuildGridHQDashboard() {
  const router = useRouter();
  const { enterWorkspace } = useWorkspaceStore();

  const { data: allClients = mockClients } = useQuery<Client[]>({
    queryKey: ["crm-clients"],
    queryFn: () => crmApi.clients(),
    initialData: mockClients,
  });

  const { data: product } = useQuery<Product>({
    queryKey: ["product", "buildgrid"],
    queryFn: () => dashboardApi.product("buildgrid"),
    initialData: mockProducts.find((p) => p.slug === "buildgrid") ?? mockProducts[0],
  });

  const buildgridClients = allClients.filter((c) =>
    c.products.some((p) => p.productSlug === "buildgrid")
  );
  const activeCount   = buildgridClients.filter((c) => c.onboardingStatus === "active").length;
  const totalRevenue  = buildgridClients.reduce((s, c) => s + c.dealValue, 0);

  const mrr        = product?.revenue ?? 0;
  const activeUsers = product?.activeUsers ?? 0;
  const growth     = product?.growth ?? 0;

  function handleOpenWorkspace(client: Client) {
    enterWorkspace(client.tenantId, client.name, "buildgrid");
    router.push(getWorkspaceUrl("buildgrid", client.tenantId));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · HQ"
        title="Provider Overview"
        description="SaaS-level metrics for BuildGrid — client adoption, revenue, and product usage. No tenant data shown here."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Building2 className="h-5 w-5" />}
          label="Total Clients"
          value={String(buildgridClients.length)}
          sub={`${activeCount} active`}
        />
        <KpiCard
          icon={<HardHat className="h-5 w-5" />}
          label="Monthly Revenue"
          value={formatCurrency(mrr)}
          sub={`+${growth}% MoM`}
        />
        <KpiCard
          icon={<Users2 className="h-5 w-5" />}
          label="Active Users"
          value={activeUsers.toLocaleString()}
          sub="across all tenants"
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Contract Value"
          value={formatCurrency(totalRevenue)}
          sub="from active deals"
        />
      </div>

      {/* Usage stats from product data */}
      {product?.usage && product.usage.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {product.usage.map((u) => (
            <Card key={u.name}>
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">{u.name}</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">{u.value}</p>
                <p className="mt-0.5 text-xs text-emerald-400">{u.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clients table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
              <BarChart3 className="h-4 w-4 text-slate-400" />
              BuildGrid Clients
            </div>
            <Link href="/crm/clients" className="text-xs text-cyan-400 hover:underline">
              View in CRM →
            </Link>
          </div>

          {buildgridClients.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No clients are using BuildGrid yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {buildgridClients.map((client) => {
                const provisioned = client.products.find(
                  (p) => p.productSlug === "buildgrid"
                )?.provisioned;
                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-100">{client.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            CLIENT_STATUS_CLASS[client.onboardingStatus] ?? "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {client.onboardingStatus}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {client.organization} · {client.region} ·{" "}
                        <span className="font-mono">{client.tenantId}</span>
                      </p>
                    </div>

                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-200">
                          {formatCurrency(client.dealValue)}
                        </p>
                        <p className="text-xs text-slate-500">{client.planName ?? "—"}</p>
                      </div>

                      {provisioned ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenWorkspace(client)}
                          className="gap-1.5 text-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open Workspace
                        </Button>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1 text-xs text-slate-500">
                          Not provisioned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MRR trend */}
      {product?.mrrSeries && product.mrrSeries.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-medium text-slate-100">MRR Trend</p>
            <div className="flex items-end gap-2 h-24">
              {product.mrrSeries.map((point, i) => {
                const max = Math.max(...product.mrrSeries.map((p) => p.revenue ?? 0));
                const pct = max > 0 ? ((point.revenue ?? 0) / max) * 100 : 0;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="w-full rounded-t bg-cyan-400/30 hover:bg-cyan-400/50 transition-colors"
                      style={{ height: `${pct}%` }}
                      title={formatCurrency(point.revenue ?? 0)}
                    />
                    <span className="text-[10px] text-slate-600">{point.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
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
