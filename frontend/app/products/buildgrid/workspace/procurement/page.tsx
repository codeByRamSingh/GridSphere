"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildgridApi } from "@/lib/api";
import { bgProjects, bgPurchaseOrders, bgVendors } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import type { BGProject, BGPurchaseOrder, BGPurchaseOrderStatus, BGVendor } from "@/types";

const PO_STATUS_LABEL: Record<BGPurchaseOrderStatus, string> = {
  draft: "Draft", sent: "Sent", approved: "Approved", fulfilled: "Fulfilled", cancelled: "Cancelled",
};

const PO_STATUS_CLASS: Record<BGPurchaseOrderStatus, string> = {
  draft:     "bg-slate-800 text-slate-400",
  sent:      "bg-blue-900/50 text-blue-300 ring-1 ring-blue-500/30",
  approved:  "bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500/30",
  fulfilled: "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/30",
  cancelled: "bg-red-900/50 text-red-400 ring-1 ring-red-500/30",
};

const ALL_STATUSES: BGPurchaseOrderStatus[] = ["draft", "sent", "approved", "fulfilled", "cancelled"];

type CreatePOForm = {
  projectId: string;
  vendorId: string;
  amount: string;
  description: string;
  status: BGPurchaseOrderStatus;
};

const EMPTY_FORM: CreatePOForm = {
  projectId: "", vendorId: "", amount: "", description: "", status: "draft",
};

function Procurement() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id") ?? "";
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BGPurchaseOrderStatus | "">("");
  const [projectFilter, setProjectFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreatePOForm>(EMPTY_FORM);

  const tenantProjects  = bgProjects.filter((p) => !tenantId || p.tenantId === tenantId);
  const tenantProjectIds = new Set(tenantProjects.map((p) => p.id));
  const tenantOrders    = bgPurchaseOrders.filter((o) => tenantProjectIds.has(o.projectId));
  const tenantVendors   = bgVendors.filter((v) => !tenantId || v.tenantId === tenantId);

  const { data: projects = tenantProjects } = useQuery<BGProject[]>({
    queryKey: ["bg-projects", tenantId],
    queryFn:  () => buildgridApi.projects(tenantId || undefined),
    initialData: tenantProjects,
  });

  const { data: vendors = tenantVendors } = useQuery<BGVendor[]>({
    queryKey: ["bg-vendors", tenantId],
    queryFn:  () => buildgridApi.vendors(tenantId || undefined),
    initialData: tenantVendors,
  });

  const { data: orders = tenantOrders } = useQuery<BGPurchaseOrder[]>({
    queryKey: ["bg-purchase-orders", tenantId, projectFilter],
    queryFn:  () => buildgridApi.purchaseOrders(projectFilter || undefined),
    initialData: projectFilter ? tenantOrders.filter((o) => o.projectId === projectFilter) : tenantOrders,
  });

  const createMutation = useMutation({
    mutationFn: (payload: unknown) => buildgridApi.createPurchaseOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bg-purchase-orders", tenantId] });
      setShowCreate(false);
      setForm(EMPTY_FORM);
    },
  });

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      (!q || (o.vendorName ?? "").toLowerCase().includes(q) || (o.description ?? "").toLowerCase().includes(q) || (o.projectName ?? "").toLowerCase().includes(q)) &&
      (!statusFilter || o.status === statusFilter) &&
      (!projectFilter || o.projectId === projectFilter)
    );
  });

  const totalFiltered = filtered.reduce((s, o) => s + o.amount, 0);

  const handleCreate = () => {
    if (!form.projectId || !form.vendorId) return;
    const selectedVendor  = vendors.find((v) => v.id === form.vendorId);
    const selectedProject = projects.find((p) => p.id === form.projectId);
    createMutation.mutate({
      project_id: form.projectId,
      vendor_id: form.vendorId,
      vendor_name: selectedVendor?.name,
      project_name: selectedProject?.name,
      amount: parseFloat(form.amount) || 0,
      description: form.description,
      status: form.status,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · Procurement"
        title="Purchase Orders"
        description="Manage vendor POs, track approval status, and monitor procurement spend by project."
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New PO
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-white/8 bg-slate-900/40 px-5 py-3">
        {(["draft", "sent", "approved", "fulfilled"] as BGPurchaseOrderStatus[]).map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const value = orders.filter((o) => o.status === s).reduce((acc, o) => acc + o.amount, 0);
          return (
            <div key={s} className="flex flex-col">
              <span className="text-xs text-slate-500 capitalize">{PO_STATUS_LABEL[s]}</span>
              <span className="text-sm font-semibold text-slate-100">{count}</span>
              <span className="text-xs text-slate-500">{formatCurrency(value)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <Input placeholder="Search vendor, description…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BGPurchaseOrderStatus | "")}
          className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{PO_STATUS_LABEL[s]}</option>)}
        </select>
        {(search || statusFilter || projectFilter) && (
          <Button variant="outline" className="text-slate-400" onClick={() => { setSearch(""); setStatusFilter(""); setProjectFilter(""); }}>Clear</Button>
        )}
      </div>

      {showCreate && (
        <Card className="border-cyan-300/20 bg-slate-900/60">
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-semibold text-slate-100">New Purchase Order</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Project *</label>
                <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  <option value="">Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Vendor *</label>
                <select value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  <option value="">Select vendor…</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Amount (₹)</label>
                <Input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BGPurchaseOrderStatus })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{PO_STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Description</label>
                <Input placeholder="Brief scope of supply or service" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleCreate} disabled={!form.projectId || !form.vendorId || createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create PO"}
              </Button>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">No purchase orders match your filters.</div>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-xs text-slate-500">
                      <th className="px-5 py-3 text-left font-medium">Vendor</th>
                      <th className="px-4 py-3 text-left font-medium">Project</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                      <th className="px-4 py-3 text-right font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40">
                        <td className="px-5 py-3 font-medium text-slate-100">{o.vendorName}</td>
                        <td className="px-4 py-3 text-slate-400">{o.projectName}</td>
                        <td className="max-w-xs px-4 py-3"><p className="truncate text-slate-400">{o.description}</p></td>
                        <td className="px-4 py-3">
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", PO_STATUS_CLASS[o.status])}>
                            {PO_STATUS_LABEL[o.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-200">{formatCurrency(o.amount)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between rounded-lg border border-white/8 bg-slate-900/40 px-5 py-3">
            <p className="text-xs text-slate-500">{filtered.length} orders shown</p>
            <p className="text-sm font-semibold text-slate-100">
              Total: <span className="text-emerald-300">{formatCurrency(totalFiltered)}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function BuildGridWorkspaceProcurement() {
  return <Suspense><Procurement /></Suspense>;
}
