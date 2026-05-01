"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Box,
  Building2,
  CheckCircle2,
  CircleDot,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  Shield,
  Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { crmApi } from "@/lib/api";
import { clients as mockClients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { getWorkspaceUrl, getProductConfig } from "@/lib/product-registry";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { ActiveProduct } from "@/store/workspace-store";
import type { Client, ClientUser, OnboardingStatus } from "@/types";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<OnboardingStatus, string> = {
  draft: "Draft",
  provisioning: "Provisioning",
  active: "Active",
  suspended: "Suspended",
  churned: "Churned",
};

const STATUS_CLASS: Record<OnboardingStatus, string> = {
  draft: "bg-slate-800 text-slate-400",
  provisioning: "bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/30",
  active: "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  suspended: "bg-orange-900/50 text-orange-300 ring-1 ring-orange-500/30",
  churned: "bg-red-900/50 text-red-400 ring-1 ring-red-500/30",
};

const PRODUCT_LABEL: Record<string, string> = {
  campusgrid: "CampusGrid",
  buildgrid: "BuildGrid",
  farmgrid: "FarmGrid",
};

const PRODUCT_COLOR: Record<string, string> = {
  campusgrid: "bg-violet-900/50 text-violet-200",
  buildgrid: "bg-cyan-900/50 text-cyan-200",
  farmgrid: "bg-emerald-900/50 text-emerald-200",
};

const ROLE_COLOR: Record<string, string> = {
  admin: "text-cyan-300",
  manager: "text-violet-300",
  viewer: "text-slate-400",
};

const ONBOARDING_STEPS = [
  { key: "basic_collected", label: "Basic info collected" },
  { key: "plan_assigned", label: "Plan assigned" },
  { key: "tenant_provisioned", label: "Tenant provisioned" },
  { key: "invite_sent", label: "Admin invitation sent" },
  { key: "first_login", label: "Admin first login" },
  { key: "product_setup", label: "Product setup complete" },
];

function getChecklistState(client: Client) {
  const adminUser = client.users.find((u) => u.role === "admin");
  return {
    basic_collected: Boolean(client.email && client.organization),
    plan_assigned: Boolean(client.planId),
    tenant_provisioned: ["provisioning", "active"].includes(client.onboardingStatus),
    invite_sent: client.users.some((u) => u.invited),
    first_login: adminUser?.accepted ?? false,
    product_setup: client.products.some((p) => p.provisioned),
  };
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const clientId = Number(id);
  const [tab, setTab] = useState<"overview" | "products" | "team" | "checklist">("overview");

  const queryClient = useQueryClient();

  const fallback = mockClients.find((c) => c.id === clientId) ?? mockClients[0];

  const { data: client, isLoading } = useQuery({
    queryKey: ["crm-client", clientId],
    queryFn: () => crmApi.client(clientId),
    initialData: fallback,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => crmApi.updateStatus(clientId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm-client", clientId] }),
  });

  if (isLoading || !client) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading client…
      </div>
    );
  }

  const checklist = getChecklistState(client as Client);
  const checklistDone = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <Link href="/crm/clients">
          <Button variant="outline" className="mt-1 h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            eyebrow="CRM · Clients"
            title={client.name}
            description={`Tenant: ${client.tenantId} · ${client.industry}`}
            action={
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[client.onboardingStatus as OnboardingStatus]}`}>
                {STATUS_LABEL[client.onboardingStatus as OnboardingStatus]}
              </span>
            }
          />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiPill icon={<DollarSign className="h-3.5 w-3.5" />} label="Deal Value" value={formatCurrency(client.dealValue)} />
        <KpiPill icon={<Box className="h-3.5 w-3.5" />} label="Products" value={String(client.products.length)} />
        <KpiPill icon={<Users className="h-3.5 w-3.5" />} label="Users" value={String(client.users.length)} />
        <KpiPill
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Onboarding"
          value={`${checklistDone}/${ONBOARDING_STEPS.length}`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {(["overview", "products", "team", "checklist"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition
              ${tab === t
                ? "border-b-2 border-cyan-400 text-cyan-200"
                : "text-slate-500 hover:text-slate-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "overview" && <OverviewTab client={client as Client} />}
      {tab === "products" && <ProductsTab client={client as Client} />}
      {tab === "team" && <TeamTab users={client.users as ClientUser[]} />}
      {tab === "checklist" && (
        <ChecklistTab
          client={client as Client}
          checklist={checklist}
          onStatusChange={(s) => statusMutation.mutate(s)}
          updating={statusMutation.isPending}
        />
      )}
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function OverviewTab({ client }: { client: Client }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="px-5 pb-2 pt-5">
          <p className="text-xs font-medium text-slate-400">Contact &amp; Identity</p>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          <InfoRow icon={<Building2 className="h-3.5 w-3.5" />} label="Organization" value={client.organization} />
          <InfoRow icon={<Users className="h-3.5 w-3.5" />} label="Contact Person" value={client.contactPerson || "—"} />
          <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={client.email} />
          <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={client.phone || "—"} />
          <InfoRow icon={<Globe className="h-3.5 w-3.5" />} label="Region" value={client.region || "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-5 pb-2 pt-5">
          <p className="text-xs font-medium text-slate-400">Plan &amp; Commercial</p>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          <InfoRow icon={<Shield className="h-3.5 w-3.5" />} label="Plan" value={client.planName ?? "—"} />
          <InfoRow icon={<DollarSign className="h-3.5 w-3.5" />} label="Deal Value" value={formatCurrency(client.dealValue)} />
          <InfoRow icon={<CircleDot className="h-3.5 w-3.5" />} label="Portal" value={client.portalEnabled ? "Enabled" : "Disabled"} />
          <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Onboarded" value={new Date(client.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
        </CardContent>
      </Card>

      {client.notes && (
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <p className="mb-2 text-xs font-medium text-slate-400">Notes</p>
            <p className="text-sm leading-6 text-slate-300">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {client.tags.length > 0 && (
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-wrap gap-2 p-5">
            {client.tags.map((t) => (
              <span key={t} className="rounded bg-white/5 px-3 py-1 text-xs text-slate-400 ring-1 ring-white/10">
                {t}
              </span>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductsTab({ client }: { client: Client }) {
  const router = useRouter();
  const { enterWorkspace } = useWorkspaceStore();

  function handleOpenWorkspace(productSlug: string) {
    const config = getProductConfig(productSlug);
    if (!config) return;
    enterWorkspace(client.tenantId, client.name, productSlug as ActiveProduct);
    router.push(getWorkspaceUrl(productSlug, client.tenantId));
  }

  return (
    <div className="space-y-3">
      {client.products.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">No products assigned.</p>
      )}
      {client.products.map((p) => {
        const config = getProductConfig(p.productSlug);
        return (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2.5 py-1 text-xs font-semibold ${PRODUCT_COLOR[p.productSlug] ?? "bg-slate-800 text-slate-300"}`}>
                    {PRODUCT_LABEL[p.productSlug] ?? p.productSlug}
                  </span>
                  <span className={`text-xs ${p.provisioned ? "text-emerald-400" : "text-amber-400"}`}>
                    {p.provisioned ? "✓ Provisioned" : "⏳ Pending"}
                  </span>
                  {config && (
                    <span className="text-xs text-slate-600">{config.description}</span>
                  )}
                </div>

                {p.provisioned && config ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenWorkspace(p.productSlug)}
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

              {p.enabledModules.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.enabledModules.map((m) => (
                    <span key={m} className="rounded bg-white/5 px-2 py-0.5 text-xs capitalize text-slate-400">
                      {m.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TeamTab({ users }: { users: ClientUser[] }) {
  return (
    <div className="space-y-2">
      {users.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">No users added.</p>
      )}
      {users.map((u) => (
        <Card key={u.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                {u.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-200">{u.email}</p>
                <p className={`text-xs capitalize ${ROLE_COLOR[u.role] ?? "text-slate-500"}`}>{u.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {u.invited && (
                <span className={`rounded-full px-2 py-0.5 ${u.accepted ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"}`}>
                  {u.accepted ? "Accepted" : "Invite pending"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChecklistTab({
  client,
  checklist,
  onStatusChange,
  updating,
}: {
  client: Client;
  checklist: Record<string, boolean>;
  onStatusChange: (s: string) => void;
  updating: boolean;
}) {
  const doneCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Progress checklist */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Onboarding Progress</p>
            <span className="text-xs text-slate-500">{doneCount} / {ONBOARDING_STEPS.length}</span>
          </div>
          <div className="space-y-3">
            {ONBOARDING_STEPS.map((step) => {
              const done = checklist[step.key];
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                    ${done ? "bg-emerald-600" : "border border-white/20 bg-slate-800"}`}
                  >
                    {done && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`text-sm ${done ? "text-slate-300" : "text-slate-500"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status management */}
      <Card>
        <CardContent className="p-5">
          <p className="mb-4 text-xs font-medium text-slate-400">Manage Status</p>
          <p className="mb-3 text-sm text-slate-400">
            Current:{" "}
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[client.onboardingStatus]}`}>
              {STATUS_LABEL[client.onboardingStatus]}
            </span>
          </p>
          <div className="space-y-2">
            {(["provisioning", "active", "suspended", "churned"] as OnboardingStatus[]).map((s) => (
              <Button
                key={s}
                variant="outline"
                className={`w-full justify-start capitalize ${client.onboardingStatus === s ? "border-cyan-400/40 text-cyan-300" : "text-slate-400"}`}
                disabled={client.onboardingStatus === s || updating}
                onClick={() => onStatusChange(s)}
              >
                {STATUS_LABEL[s]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function KpiPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="text-slate-500">{icon}</span>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-sm font-semibold text-slate-100">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-slate-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="text-xs text-slate-500">{label}: </span>
        <span className="text-xs text-slate-300">{value}</span>
      </div>
    </div>
  );
}
