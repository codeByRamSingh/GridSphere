"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  UserPlus,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { crmApi, pricingApi } from "@/lib/api";
import { plans as mockPlans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const INDUSTRIES = ["Education", "Construction", "Healthcare", "Legal", "Agriculture"];

const PRODUCTS = [
  { slug: "campusgrid", name: "CampusGrid", desc: "Education ERP" },
  { slug: "buildgrid", name: "BuildGrid", desc: "Construction ERP" },
  { slug: "farmgrid", name: "FarmGrid", desc: "Agriculture ERP" },
];

const ROLES = ["admin", "manager", "viewer"] as const;

type UserEntry = { email: string; role: "admin" | "manager" | "viewer" };

interface FormState {
  // Basic
  name: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  // Business
  industry: string;
  selectedProducts: string[];
  dealValue: string;
  region: string;
  // System
  tenantId: string;
  planId: string;
  portalEnabled: boolean;
  // Operational
  notes: string;
  tags: string;
  users: UserEntry[];
}

const INITIAL: FormState = {
  name: "",
  organization: "",
  contactPerson: "",
  email: "",
  phone: "",
  industry: "",
  selectedProducts: [],
  dealValue: "",
  region: "",
  tenantId: "",
  planId: "",
  portalEnabled: true,
  notes: "",
  tags: "",
  users: [{ email: "", role: "admin" }],
};

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Business" },
  { id: 3, label: "System Setup" },
  { id: 4, label: "Team & Notes" },
];

// ── page ─────────────────────────────────────────────────────────────────────

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { data: plansData } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: pricingApi.plans,
    initialData: mockPlans,
  });
  const planList: Plan[] = Array.isArray(plansData) ? plansData : mockPlans;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "organization" && !f.tenantId) {
        next.tenantId = slugify(value as string);
      }
      return next;
    });
  }

  function toggleProduct(slug: string) {
    set(
      "selectedProducts",
      form.selectedProducts.includes(slug)
        ? form.selectedProducts.filter((s) => s !== slug)
        : [...form.selectedProducts, slug]
    );
  }

  function updateUser(index: number, field: keyof UserEntry, value: string) {
    const users = form.users.map((u, i) =>
      i === index ? { ...u, [field]: value } : u
    );
    set("users", users);
  }

  function addUser() {
    set("users", [...form.users, { email: "", role: "admin" }]);
  }

  function removeUser(index: number) {
    set("users", form.users.filter((_, i) => i !== index));
  }

  function canAdvance() {
    if (step === 1) return form.name.trim() && form.email.trim();
    if (step === 2) return form.industry && form.selectedProducts.length > 0;
    if (step === 3) return form.tenantId.trim() && form.planId;
    return true;
  }

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        organization: form.organization || form.name,
        contact_person: form.contactPerson,
        email: form.email,
        phone: form.phone,
        industry: form.industry,
        tenant_id: form.tenantId,
        plan_id: form.planId ? Number(form.planId) : null,
        region: form.region,
        deal_value: form.dealValue ? Number(form.dealValue) : 0,
        portal_enabled: form.portalEnabled,
        notes: form.notes,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        products: form.selectedProducts.map((slug) => ({ product_slug: slug, enabled_modules: [] })),
        users: form.users.filter((u) => u.email.trim()).map((u) => ({ email: u.email, role: u.role })),
      };
      await crmApi.createClient(payload);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create client. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <SuccessScreen name={form.name} tenantId={form.tenantId} onGoToList={() => router.push("/crm/clients")} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/crm/clients">
          <Button variant="outline" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <p className="text-xs text-slate-500">CRM · Clients</p>
          <h1 className="text-lg font-semibold text-slate-50">Onboard New Client</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition
                ${step === s.id
                  ? "bg-cyan-400 text-slate-950"
                  : step > s.id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-500"
                }`}
            >
              {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
            </button>
            <span className={`hidden text-xs sm:block ${step === s.id ? "text-slate-100" : "text-slate-500"}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-slate-700" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <Card>
        <CardContent className="p-6">
          {step === 1 && <Step1 form={form} set={set} />}
          {step === 2 && <Step2 form={form} set={set} toggleProduct={toggleProduct} />}
          {step === 3 && <Step3 form={form} set={set} plans={planList} />}
          {step === 4 && (
            <Step4
              form={form}
              set={set}
              updateUser={updateUser}
              addUser={addUser}
              removeUser={removeUser}
            />
          )}

          {error && (
            <p className="mt-4 rounded-md bg-red-950/50 px-4 py-2 text-xs text-red-400 ring-1 ring-red-500/30">
              {error}
            </p>
          )}

          {/* Nav */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={submitting || !canAdvance()}
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Provisioning…</>
                ) : (
                  <><Zap className="h-4 w-4" /> Create Client &amp; Provision Workspace</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm font-semibold text-slate-100">{children}</h2>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function Step1({ form, set }: { form: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Basic Information</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client Name *">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mother Teresa Educational Trust" />
        </Field>
        <Field label="Organization Name">
          <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="Same as client name" />
        </Field>
        <Field label="Contact Person">
          <Input value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} placeholder="Sr. Maria Fernandes" />
        </Field>
        <Field label="Email *">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="admin@client.com" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91-80-0000-0000" />
        </Field>
      </div>
    </div>
  );
}

function Step2({
  form,
  set,
  toggleProduct,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleProduct: (slug: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionLabel>Business Details</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Industry *">
          <select
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Region / Location">
          <Input value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="North India, South Asia…" />
        </Field>
        <Field label="Deal Value (₹/yr)">
          <Input type="number" value={form.dealValue} onChange={(e) => set("dealValue", e.target.value)} placeholder="180000" />
        </Field>
      </div>
      <Field label="Product Assignment *">
        <div className="mt-1 grid gap-2 sm:grid-cols-3">
          {PRODUCTS.map((p) => {
            const selected = form.selectedProducts.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleProduct(p.slug)}
                className={`rounded-md border px-4 py-3 text-left text-sm transition
                  ${selected
                    ? "border-cyan-400/60 bg-cyan-900/20 text-cyan-100"
                    : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/20"
                  }`}
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-xs opacity-60">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function Step3({
  form,
  set,
  plans,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  plans: Plan[];
}) {
  return (
    <div className="space-y-5">
      <SectionLabel>System Setup</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tenant ID (auto-generated) *">
          <Input
            value={form.tenantId}
            onChange={(e) => set("tenantId", slugify(e.target.value))}
            placeholder="mother-teresa-edu"
            className="font-mono text-xs"
          />
          <p className="mt-1 text-xs text-slate-600">Unique workspace slug. Used in tenant routing.</p>
        </Field>
      </div>

      <Field label="Select Plan *">
        <div className="mt-1 grid gap-2 sm:grid-cols-3">
          {plans.map((p) => {
            const selected = form.planId === String(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => set("planId", String(p.id))}
                className={`rounded-md border px-4 py-3 text-left transition
                  ${selected
                    ? "border-cyan-400/60 bg-cyan-900/20"
                    : "border-white/10 bg-slate-900 hover:border-white/20"
                  }`}
              >
                <p className={`text-sm font-semibold ${selected ? "text-cyan-200" : "text-slate-300"}`}>{p.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{formatCurrency(p.priceMonthly, true)}/mo</p>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Client Portal">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("portalEnabled", !form.portalEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition
              ${form.portalEnabled ? "bg-cyan-500" : "bg-slate-700"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition
              ${form.portalEnabled ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <span className="text-sm text-slate-400">
            {form.portalEnabled ? "Enabled — client will receive portal access" : "Disabled"}
          </span>
        </div>
      </Field>
    </div>
  );
}

function Step4({
  form,
  set,
  updateUser,
  addUser,
  removeUser,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  updateUser: (i: number, field: keyof UserEntry, value: string) => void;
  addUser: () => void;
  removeUser: (i: number) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionLabel>Team &amp; Notes</SectionLabel>

      <Field label="Invite Users">
        <div className="mt-1 space-y-2">
          {form.users.map((u, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                type="email"
                value={u.email}
                onChange={(e) => updateUser(i, "email", e.target.value)}
                placeholder="user@client.com"
                className="flex-1"
              />
              <select
                value={u.role}
                onChange={(e) => updateUser(i, "role", e.target.value)}
                className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              {form.users.length > 1 && (
                <Button
                  variant="outline"
                  className="h-9 w-9 shrink-0 p-0 text-slate-500 hover:text-red-400"
                  onClick={() => removeUser(i)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" className="mt-1 text-xs" onClick={addUser}>
            <UserPlus className="h-3.5 w-3.5" /> Add another user
          </Button>
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tags (comma-separated)">
          <Input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="education, karnataka, enterprise"
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={4}
          placeholder="Add any relevant notes about this client…"
          className="w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-cyan-400/50"
        />
      </Field>

      {/* Summary preview */}
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4 text-xs">
        <p className="mb-2 font-medium text-slate-400">Workspace summary</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-slate-500">
          <span>Tenant ID</span><span className="font-mono text-slate-300">{form.tenantId || "—"}</span>
          <span>Products</span><span className="text-slate-300">{form.selectedProducts.join(", ") || "—"}</span>
          <span>Portal</span><span className="text-slate-300">{form.portalEnabled ? "Enabled" : "Disabled"}</span>
          <span>Users to invite</span><span className="text-slate-300">{form.users.filter((u) => u.email).length}</span>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({
  name,
  tenantId,
  onGoToList,
}: {
  name: string;
  tenantId: string;
  onGoToList: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/50 ring-1 ring-emerald-500/40">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Workspace Provisioned</h2>
        <p className="mt-2 text-sm text-slate-400">
          <strong className="text-slate-200">{name}</strong> has been onboarded successfully.
        </p>
        <p className="mt-1 font-mono text-xs text-slate-600">tenant: {tenantId}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onGoToList}>
          <Building2 className="h-4 w-4" /> View All Clients
        </Button>
        <Link href="/crm/clients/new">
          <Button>
            <Zap className="h-4 w-4" /> Onboard Another
          </Button>
        </Link>
      </div>
    </div>
  );
}
