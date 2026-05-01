"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardApi } from "@/lib/api";
import { products as mockProducts, productGrowth } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function BuildGridAnalyticsPage() {
  const { data: product } = useQuery<Product>({
    queryKey: ["product", "buildgrid"],
    queryFn: () => dashboardApi.product("buildgrid"),
    initialData: mockProducts.find((p) => p.slug === "buildgrid") ?? mockProducts[0],
  });

  const bgGrowth = productGrowth.map((pt) => ({ name: pt.name, value: pt.buildGrid ?? 0 }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · Analytics"
        title="Product Analytics"
        description="Adoption, feature usage, and support metrics across all BuildGrid tenants."
      />

      {/* Feature adoption */}
      {product?.adoption && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-medium text-slate-100">Feature Adoption</p>
            <div className="space-y-3">
              {product.adoption.map((f) => (
                <div key={f.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{f.name}</span>
                    <span className="tabular-nums text-slate-300">{f.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${f.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MRR trend sparkline */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-medium text-slate-100">MRR (6 months)</p>
            <div className="flex items-end gap-2" style={{ height: 80 }}>
              {(product?.mrrSeries ?? []).map((pt, i) => {
                const max = Math.max(...(product?.mrrSeries ?? []).map((p) => p.revenue ?? 0));
                const pct = max > 0 ? ((pt.revenue ?? 0) / max) * 100 : 0;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="w-full rounded-t bg-cyan-400/30 hover:bg-cyan-400/50 transition-colors" style={{ height: `${pct}%` }} title={formatCurrency(pt.revenue ?? 0)} />
                    <span className="text-[10px] text-slate-600">{pt.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-right text-sm font-semibold text-emerald-300">
              {formatCurrency(product?.revenue ?? 0)} / mo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-medium text-slate-100">Customer Count (6 months)</p>
            <div className="flex items-end gap-2" style={{ height: 80 }}>
              {bgGrowth.map((pt, i) => {
                const max = Math.max(...bgGrowth.map((p) => p.value));
                const pct = max > 0 ? (pt.value / max) * 100 : 0;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="w-full rounded-t bg-violet-400/30 hover:bg-violet-400/50 transition-colors" style={{ height: `${pct}%` }} title={String(pt.value)} />
                    <span className="text-[10px] text-slate-600">{pt.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-right text-sm font-semibold text-violet-300">
              {product?.activeUsers?.toLocaleString() ?? "—"} active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Support tickets */}
      {product?.supportTickets && product.supportTickets.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-white/8 px-5 py-4 text-sm font-medium text-slate-100">
              Open Support Tickets
            </div>
            <div className="divide-y divide-white/5">
              {product.supportTickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-slate-200">{t.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{t.customer} · {t.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.priority === "Critical" || t.priority === "High" ? "bg-red-900/50 text-red-300" : "bg-slate-800 text-slate-400"}`}>
                      {t.priority}
                    </span>
                    <span className="text-xs text-slate-500">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
