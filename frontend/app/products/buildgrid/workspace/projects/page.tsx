"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildgridApi } from "@/lib/api";
import { bgProjects } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import type { BGProject, BGProjectStatus } from "@/types";

const STATUS_LABEL: Record<BGProjectStatus, string> = {
  planning:  "Planning",
  active:    "Active",
  completed: "Completed",
  on_hold:   "On Hold",
};

const STATUS_CLASS: Record<BGProjectStatus, string> = {
  planning:  "bg-slate-800 text-slate-400",
  active:    "bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500/30",
  completed: "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  on_hold:   "bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/30",
};

const ALL_STATUSES: BGProjectStatus[] = ["planning", "active", "completed", "on_hold"];

type CreateProjectForm = {
  name: string;
  location: string;
  status: BGProjectStatus;
  startDate: string;
  endDate: string;
  totalBudget: string;
};

const EMPTY_FORM: CreateProjectForm = {
  name: "", location: "", status: "planning", startDate: "", endDate: "", totalBudget: "",
};

function Projects() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id") ?? "";
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BGProjectStatus | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateProjectForm>(EMPTY_FORM);

  const tenantProjects = bgProjects.filter((p) => !tenantId || p.tenantId === tenantId);

  const { data: projects = tenantProjects } = useQuery<BGProject[]>({
    queryKey: ["bg-projects", tenantId],
    queryFn:  () => buildgridApi.projects(tenantId || undefined),
    initialData: tenantProjects,
  });

  const createMutation = useMutation({
    mutationFn: (payload: unknown) => buildgridApi.createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bg-projects", tenantId] });
      setShowCreate(false);
      setForm(EMPTY_FORM);
    },
  });

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || (p.location ?? "").toLowerCase().includes(q)) &&
      (!statusFilter || p.status === statusFilter)
    );
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createMutation.mutate({
      name: form.name,
      location: form.location,
      status: form.status,
      start_date: form.startDate,
      end_date: form.endDate || null,
      total_budget: parseFloat(form.totalBudget) || 0,
      tenant_id: tenantId,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · Projects"
        title="Projects"
        description="Manage construction projects, track budgets, and monitor progress by site."
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <Input placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BGProjectStatus | "")}
          className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        {(search || statusFilter) && (
          <Button variant="outline" className="text-slate-400" onClick={() => { setSearch(""); setStatusFilter(""); }}>
            Clear
          </Button>
        )}
      </div>

      {showCreate && (
        <Card className="border-cyan-300/20 bg-slate-900/60">
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-semibold text-slate-100">New Project</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Project Name *</label>
                <Input placeholder="e.g. North Campus Tower Block B" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Location</label>
                <Input placeholder="Site address or city" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BGProjectStatus })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Start Date</label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">End Date</label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Total Budget (₹)</label>
                <Input type="number" placeholder="e.g. 45000000" value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleCreate} disabled={!form.name.trim() || createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create Project"}
              </Button>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">No projects match your filters.</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs text-slate-500">
                    <th className="px-5 py-3 text-left font-medium">Project</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Budget</th>
                    <th className="px-4 py-3 text-right font-medium">Spent</th>
                    <th className="px-4 py-3 text-right font-medium">Progress</th>
                    <th className="px-4 py-3 text-right font-medium">Orders</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-900/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800">
                            <Building2 className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-100">{p.name}</p>
                            {p.location && (
                              <p className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="h-3 w-3" />{p.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", STATUS_CLASS[p.status])}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-slate-300">{formatCurrency(p.totalBudget)}</td>
                      <td className="px-4 py-4 text-right tabular-nums text-slate-300">{formatCurrency(p.spentToDate)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${p.completionPct}%` }} />
                          </div>
                          <span className="w-9 text-right text-xs tabular-nums text-slate-400">{p.completionPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-slate-400">{p.activeOrders}</td>
                      <td className="px-4 py-4 text-right">
                        <ChevronRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {filtered.map((p) => p.startDate && (
          <div key={p.id} className="flex items-center gap-1.5 rounded-full border border-white/8 bg-slate-900/60 px-3 py-1 text-xs text-slate-400">
            <CalendarDays className="h-3 w-3 text-slate-600" />
            {p.name.split(" ").slice(0, 3).join(" ")} · {new Date(p.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            {p.endDate && <> → {new Date(p.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BuildGridWorkspaceProjects() {
  return <Suspense><Projects /></Suspense>;
}
