"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  Plus,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { crmApi } from "@/lib/api";
import { clients as mockClients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Client, OnboardingStatus } from "@/types";

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
  campusgrid: "bg-violet-900/50 text-violet-300",
  buildgrid: "bg-cyan-900/50 text-cyan-300",
  farmgrid: "bg-emerald-900/50 text-emerald-300",
};

const ALL_INDUSTRIES = ["Education", "Construction", "Healthcare", "Legal", "Agriculture"];
const ALL_PLANS = ["Basic", "Pro", "Enterprise"];
const ALL_STATUSES: OnboardingStatus[] = ["draft", "provisioning", "active", "suspended", "churned"];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "">("");

  const { data: clientData } = useQuery({
    queryKey: ["crm-clients"],
    queryFn: crmApi.clients,
    initialData: mockClients,
  });

  const clientList: Client[] = Array.isArray(clientData) ? clientData : mockClients;

  const filtered = clientList.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.tenantId.toLowerCase().includes(q);
    const matchIndustry = !industryFilter || c.industry === industryFilter;
    const matchPlan = !planFilter || c.planName === planFilter;
    const matchStatus = !statusFilter || c.onboardingStatus === statusFilter;
    return matchSearch && matchIndustry && matchPlan && matchStatus;
  });

  const totalDealValue = filtered.reduce((s, c) => s + c.dealValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM · Clients"
        title="Client Accounts"
        description="Manage onboarded clients, their assigned products, deal values, and tenant workspaces."
        action={
          <Link href="/crm/clients/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        }
      />

      {/* Summary KPIs */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Clients" value={String(clientList.length)} />
        <StatCard
          label="Active"
          value={String(clientList.filter((c) => c.onboardingStatus === "active").length)}
        />
        <StatCard label="Total Deal Value" value={formatCurrency(totalDealValue)} />
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <FilterSelect
          value={industryFilter}
          onChange={setIndustryFilter}
          placeholder="Industry"
          options={ALL_INDUSTRIES}
        />
        <FilterSelect
          value={planFilter}
          onChange={setPlanFilter}
          placeholder="Plan"
          options={ALL_PLANS}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as OnboardingStatus | "")}
          placeholder="Status"
          options={ALL_STATUSES}
          labelMap={STATUS_LABEL}
        />
        {(search || industryFilter || planFilter || statusFilter) && (
          <Button
            variant="outline"
            className="text-slate-400"
            onClick={() => {
              setSearch("");
              setIndustryFilter("");
              setPlanFilter("");
              setStatusFilter("");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Client cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">
          No clients match your filters.{" "}
          <Link href="/crm/clients/new" className="text-cyan-400 hover:underline">
            Add one
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="transition hover:border-white/20 hover:bg-slate-900/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">{client.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{client.tenantId}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[client.onboardingStatus]}`}>
            {STATUS_LABEL[client.onboardingStatus]}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {client.products.map((p) => (
            <span
              key={p.productSlug}
              className={`rounded px-2 py-0.5 text-xs font-medium ${PRODUCT_COLOR[p.productSlug] ?? "bg-slate-800 text-slate-400"}`}
            >
              {PRODUCT_LABEL[p.productSlug] ?? p.productSlug}
            </span>
          ))}
          {client.planName && (
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {client.planName}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Industry</p>
            <p className="mt-0.5 text-slate-300">{client.industry}</p>
          </div>
          <div>
            <p className="text-slate-500">Deal Value</p>
            <p className="mt-0.5 font-medium text-emerald-300">{formatCurrency(client.dealValue)}</p>
          </div>
          <div>
            <p className="text-slate-500">Region</p>
            <p className="mt-0.5 text-slate-300">{client.region || "—"}</p>
          </div>
          <div>
            <p className="text-slate-500">Team</p>
            <div className="mt-0.5 flex items-center gap-1 text-slate-300">
              <Users className="h-3 w-3" />
              {client.users.length} users
            </div>
          </div>
        </div>

        {client.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-500">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3 w-3" />
            {client.contactPerson || client.email}
          </div>
          <Link href={`/crm/clients/${client.id}`}>
            <Button variant="outline" className="h-7 px-3 text-xs">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  labelMap,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {labelMap ? labelMap[o as OnboardingStatus] : o}
        </option>
      ))}
    </select>
  );
}
