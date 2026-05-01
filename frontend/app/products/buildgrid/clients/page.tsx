"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { crmApi } from "@/lib/api";
import { clients as mockClients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { getWorkspaceUrl } from "@/lib/product-registry";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { Client } from "@/types";

const STATUS_CLASS: Record<string, string> = {
  active:       "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  provisioning: "bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/30",
  suspended:    "bg-orange-900/50 text-orange-300 ring-1 ring-orange-500/30",
  churned:      "bg-red-900/50 text-red-400 ring-1 ring-red-500/30",
  draft:        "bg-slate-800 text-slate-400",
};

export default function BuildGridClientsPage() {
  const router = useRouter();
  const { enterWorkspace } = useWorkspaceStore();

  const { data: allClients = mockClients } = useQuery<Client[]>({
    queryKey: ["crm-clients"],
    queryFn: () => crmApi.clients(),
    initialData: mockClients,
  });

  const buildgridClients = allClients.filter((c) =>
    c.products.some((p) => p.productSlug === "buildgrid")
  );

  function handleOpenWorkspace(client: Client) {
    enterWorkspace(client.tenantId, client.name, "buildgrid");
    router.push(getWorkspaceUrl("buildgrid", client.tenantId));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · Clients"
        title="Client Accounts"
        description={`${buildgridClients.length} client${buildgridClients.length !== 1 ? "s" : ""} using BuildGrid. Open a workspace to access their ERP data.`}
      />

      <Card>
        <CardContent className="p-0">
          {buildgridClients.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">No clients yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {buildgridClients.map((client) => {
                const product = client.products.find((p) => p.productSlug === "buildgrid");
                return (
                  <div key={client.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-100">{client.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_CLASS[client.onboardingStatus] ?? "bg-slate-800 text-slate-400"}`}>
                          {client.onboardingStatus}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {client.organization} · {client.region} · Plan: {client.planName ?? "—"}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-600">{client.tenantId}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-200">{formatCurrency(client.dealValue)}</p>
                        <p className="text-xs text-slate-500">{client.users.length} user{client.users.length !== 1 ? "s" : ""}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {product?.provisioned ? (
                          <Button size="sm" onClick={() => handleOpenWorkspace(client)} className="gap-1.5 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open Workspace
                          </Button>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1 text-xs text-slate-500">
                            Pending provisioning
                          </span>
                        )}
                        {product?.enabledModules && product.enabledModules.length > 0 && (
                          <div className="flex flex-wrap justify-end gap-1">
                            {product.enabledModules.slice(0, 3).map((m) => (
                              <span key={m} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] capitalize text-slate-500">
                                {m}
                              </span>
                            ))}
                            {product.enabledModules.length > 3 && (
                              <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-600">
                                +{product.enabledModules.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
