"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Plus, Calculator, Layers } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildgridApi } from "@/lib/api";
import { bgBOQItems, bgProjects } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { BGBOQItem, BGProject } from "@/types";

const CATEGORIES = ["Civil", "Structural", "MEP", "Finishing", "Landscaping", "Other"];

type CreateBOQForm = {
  projectId: string;
  itemName: string;
  unit: string;
  quantity: string;
  unitCost: string;
  category: string;
  notes: string;
};

const EMPTY_FORM: CreateBOQForm = {
  projectId: "", itemName: "", unit: "unit", quantity: "", unitCost: "", category: "Civil", notes: "",
};

function BOQ() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id") ?? "";
  const qc = useQueryClient();
  const [projectFilter, setProjectFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateBOQForm>(EMPTY_FORM);

  const tenantProjects = bgProjects.filter((p) => !tenantId || p.tenantId === tenantId);

  const { data: projects = tenantProjects } = useQuery<BGProject[]>({
    queryKey: ["bg-projects", tenantId],
    queryFn:  () => buildgridApi.projects(tenantId || undefined),
    initialData: tenantProjects,
  });

  const tenantProjectIds = new Set(tenantProjects.map((p) => p.id));
  const tenantBOQ = bgBOQItems.filter((b) => tenantProjectIds.has(b.projectId));
  const filteredMock = projectFilter ? tenantBOQ.filter((b) => b.projectId === projectFilter) : tenantBOQ;

  const { data: items = filteredMock } = useQuery<BGBOQItem[]>({
    queryKey: ["bg-boq", tenantId, projectFilter],
    queryFn:  () => buildgridApi.boqItems(projectFilter || undefined),
    initialData: filteredMock,
  });

  const createMutation = useMutation({
    mutationFn: (payload: unknown) => buildgridApi.createBOQItem(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bg-boq", tenantId] });
      setShowCreate(false);
      setForm(EMPTY_FORM);
    },
  });

  const handleCreate = () => {
    if (!form.itemName.trim() || !form.projectId) return;
    const qty = parseFloat(form.quantity) || 0;
    const unitCost = parseFloat(form.unitCost) || 0;
    createMutation.mutate({
      project_id: parseInt(form.projectId),
      item_name: form.itemName,
      unit: form.unit,
      quantity: qty,
      unit_cost: unitCost,
      total_cost: qty * unitCost,
      category: form.category,
      notes: form.notes,
    });
  };

  const groupedByCategory = CATEGORIES.reduce<Record<string, BGBOQItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  const grandTotal = items.reduce((s, i) => s + i.totalCost, 0);
  const categoryTotals = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat).reduce((s, i) => s + i.totalCost, 0);
    return acc;
  }, {});

  const activeProject = projects.find((p) => p.id === projectFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BuildGrid · BOQ"
        title="Bill of Quantities"
        description="Itemised cost breakdown by work category. Select a project to scope the view."
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {activeProject && (
          <div className="flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 text-xs text-cyan-300">
            <Layers className="h-3 w-3" />
            {items.length} items · {formatCurrency(grandTotal)}
          </div>
        )}
      </div>

      {showCreate && (
        <Card className="border-cyan-300/20 bg-slate-900/60">
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-semibold text-slate-100">New BOQ Item</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Project *</label>
                <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  <option value="">Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Item Name *</label>
                <Input placeholder="e.g. RCC Column Casting – Ground Floor" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Unit</label>
                <Input placeholder="m³, MT, sqft, unit…" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Quantity</label>
                <Input type="number" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Unit Cost (₹)</label>
                <Input type="number" placeholder="0" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} />
              </div>
              {form.quantity && form.unitCost && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-900/10 px-3 py-2">
                  <Calculator className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-300">
                    Total: {formatCurrency((parseFloat(form.quantity) || 0) * (parseFloat(form.unitCost) || 0))}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleCreate} disabled={!form.itemName.trim() || !form.projectId || createMutation.isPending}>
                {createMutation.isPending ? "Adding…" : "Add Item"}
              </Button>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(groupedByCategory).length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">
          No BOQ items found.{" "}
          <button className="text-cyan-400 hover:underline" onClick={() => setShowCreate(true)}>Add the first item</button>.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([category, catItems]) => (
            <Card key={category}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
                  <p className="text-sm font-medium text-slate-100">{category}</p>
                  <p className="text-sm text-slate-400">{formatCurrency(categoryTotals[category])}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-xs text-slate-600">
                        <th className="px-5 py-2 text-left font-normal">Item</th>
                        <th className="px-4 py-2 text-right font-normal">Qty</th>
                        <th className="px-4 py-2 text-right font-normal">Unit</th>
                        <th className="px-4 py-2 text-right font-normal">Unit Cost</th>
                        <th className="px-4 py-2 text-right font-normal">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {catItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="px-5 py-3 text-slate-200">{item.itemName}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-400">{item.quantity.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-500">{item.unit}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-400">{formatCurrency(item.unitCost)}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-200">{formatCurrency(item.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-white/8 bg-slate-900/30">
                        <td colSpan={4} className="px-5 py-2 text-xs text-slate-500">{catItems.length} item{catItems.length !== 1 && "s"}</td>
                        <td className="px-4 py-2 text-right text-sm font-semibold text-slate-200">{formatCurrency(categoryTotals[category])}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-5 py-4">
            <p className="text-sm font-semibold text-slate-100">Grand Total</p>
            <p className="text-lg font-semibold text-emerald-300">{formatCurrency(grandTotal)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuildGridWorkspaceBOQ() {
  return <Suspense><BOQ /></Suspense>;
}
