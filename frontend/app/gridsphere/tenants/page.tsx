"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  Package,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { gridsphereApi } from "@/lib/api";
import { getWorkspaceUrl } from "@/lib/product-registry";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { TenantOverview } from "@/types";

const STATUS_CLASS: Record<string, string> = {
  active:       "bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-500/25",
  provisioning: "bg-cyan-900/40 text-cyan-300 ring-1 ring-cyan-500/25",
  draft:        "bg-slate-800 text-slate-400",
  suspended:    "bg-amber-900/40 text-amber-300 ring-1 ring-amber-500/25",
  churned:      "bg-red-900/40 text-red-400 ring-1 ring-red-500/25",
};

const PRODUCT_PILL: Record<string, string> = {
  buildgrid:  "bg-cyan-400/10 text-cyan-300",
  campusgrid: "bg-violet-400/10 text-violet-300",
  farmgrid:   "bg-emerald-400/10 text-emerald-300",
  medigrid:   "bg-rose-400/10 text-rose-300",
};

export default function TenantsPage() {
  const router = useRouter();
  const enterWorkspace = useWorkspaceStore((s) => s.enterWorkspace);

  const { data: tenants = [], isLoading } = useQuery<TenantOverview[]>({
    queryKey: ["gridsphere-tenants"],
    queryFn: gridsphereApi.tenants,
  });

  function handleOpenWorkspace(tenant: TenantOverview, productSlug: string) {
    enterWorkspace(tenant.tenantId, tenant.name, productSlug as "buildgrid" | "campusgrid" | "farmgrid" | "medigrid");
    router.push(getWorkspaceUrl(productSlug, tenant.tenantId));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="GridSphere · Tenants"
        title="Tenant Overview"
        description={`${tenants.length} client tenant${tenants.length !== 1 ? "s" : ""} across all Grid products.`}
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="animate-pulse text-sm text-slate-500">Loading tenants…</p>
        </div>
      ) : tenants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto mb-3 h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">No tenants yet — create a client via CRM to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {tenants.map((tenant) => (
            <TenantCard key={tenant.tenantId} tenant={tenant} onOpenWorkspace={handleOpenWorkspace} />
          ))}
        </div>
      )}
    </div>
  );
}

function TenantCard({
  tenant,
  onOpenWorkspace,
}: {
  tenant: TenantOverview;
  onOpenWorkspace: (tenant: TenantOverview, productSlug: string) => void;
}) {
  return (
    <Card className="transition-colors hover:border-white/15">
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-100">{tenant.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{tenant.organization}</p>
          </div>
          <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", STATUS_CLASS[tenant.onboardingStatus] ?? STATUS_CLASS.draft)}>
            {tenant.onboardingStatus}
          </span>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {tenant.region || "—"}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {tenant.industry}
          </span>
          {tenant.planName && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
              {tenant.planName}
            </span>
          )}
          <span className="ml-auto font-semibold text-slate-300">
            {formatCurrency(tenant.dealValue)}
          </span>
        </div>

        {/* Active products */}
        {tenant.activeProducts.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Package className="h-3.5 w-3.5" />
              Active products
            </p>
            <div className="flex flex-wrap gap-2">
              {tenant.activeProducts.map((slug) => (
                <button
                  key={slug}
                  onClick={() => onOpenWorkspace(tenant, slug)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize",
                    "transition-colors hover:opacity-80",
                    PRODUCT_PILL[slug] ?? "bg-slate-800 text-slate-300"
                  )}
                >
                  {slug}
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
