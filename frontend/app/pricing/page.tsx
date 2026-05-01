"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pricingApi } from "@/lib/api";
import { plans as mockPlans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types";

const planAccent: Record<string, string> = {
  Basic: "border-slate-700",
  Pro: "border-violet-500/60",
  Enterprise: "border-cyan-400/60",
};

const planBadge: Record<string, string> = {
  Basic: "bg-slate-800 text-slate-300",
  Pro: "bg-violet-900/50 text-violet-300 ring-1 ring-violet-500/40",
  Enterprise: "bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-400/40",
};

const FEATURE_MATRIX = [
  { label: "Product access", basic: "1 product", pro: "2 products", enterprise: "Unlimited" },
  { label: "Seats", basic: "25", pro: "100", enterprise: "Unlimited" },
  { label: "Support", basic: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
  { label: "Modules", basic: "Core only", pro: "All included", enterprise: "All + Custom" },
  { label: "Account manager", basic: "—", pro: "✓", enterprise: "✓" },
  { label: "Client portal", basic: "—", pro: "✓", enterprise: "✓" },
  { label: "AI agent assignment", basic: "—", pro: "✓", enterprise: "✓" },
  { label: "Custom integrations", basic: "—", pro: "—", enterprise: "✓" },
  { label: "SLA guarantee", basic: "—", pro: "—", enterprise: "✓" },
  { label: "White-label", basic: "—", pro: "—", enterprise: "✓" },
];

export default function PricingPage() {
  const { data: pricingData } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: pricingApi.plans,
    initialData: mockPlans,
  });

  const planList: Plan[] = Array.isArray(pricingData) ? pricingData : mockPlans;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pricing"
        title="Plans & Packages"
        description="Define product packages, seat limits, feature gates, and deal pricing for client onboarding."
        action={
          <Link href="/crm/clients/new">
            <Button>
              <Zap className="h-4 w-4" />
              Onboard Client
            </Button>
          </Link>
        }
      />

      {/* Plan cards */}
      <section className="grid gap-5 md:grid-cols-3">
        {planList.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </section>

      {/* Feature matrix */}
      <Card>
        <CardHeader className="px-6 pb-0 pt-6">
          <p className="text-sm font-medium text-slate-100">Feature Comparison</p>
          <p className="text-xs text-slate-500">Full breakdown of what is included in each plan.</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="py-3 pl-6 text-left font-normal text-slate-400 w-1/2">Feature</th>
                  <th className="py-3 text-center font-medium text-slate-300">Basic</th>
                  <th className="py-3 text-center font-medium text-violet-300">Pro</th>
                  <th className="py-3 pr-6 text-center font-medium text-cyan-300">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_MATRIX.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="py-3 pl-6 text-slate-400">{row.label}</td>
                    <td className="py-3 text-center text-slate-400">{row.basic}</td>
                    <td className="py-3 text-center text-violet-300">{row.pro}</td>
                    <td className="py-3 pr-6 text-center text-cyan-300">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isEnterprise = plan.name === "Enterprise";

  return (
    <Card className={`flex flex-col border ${planAccent[plan.name] ?? "border-white/10"}`}>
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${planBadge[plan.name]}`}>
            {plan.name}
          </span>
          {plan.name === "Pro" && (
            <Badge className="bg-violet-900/60 text-violet-200 text-xs">Most popular</Badge>
          )}
        </div>

        <div className="mt-5">
          <p className="text-3xl font-bold text-slate-50">
            {formatCurrency(plan.priceMonthly, true)}
            <span className="text-sm font-normal text-slate-400">/mo</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatCurrency(plan.priceAnnual, true)}/yr
            {plan.savingsPercent > 0 && (
              <span className="ml-2 text-emerald-400">Save {plan.savingsPercent}%</span>
            )}
          </p>
        </div>

        <ul className="mt-6 flex-1 space-y-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-slate-500">
          {plan.maxSeats === 0 ? "Unlimited seats" : `Up to ${plan.maxSeats} seats`}
          {" · "}
          {plan.maxProducts === 0 ? "Unlimited products" : `${plan.maxProducts} product${plan.maxProducts > 1 ? "s" : ""}`}
        </p>

        <Link href="/crm/clients/new" className="mt-6">
          <Button
            className={`w-full ${isEnterprise ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300" : ""}`}
            variant={isEnterprise ? "default" : "outline"}
          >
            Assign to Client
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
