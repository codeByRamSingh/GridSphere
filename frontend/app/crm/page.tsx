"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

const CRM_SECTIONS = [
  {
    href: "/crm/clients",
    label: "Clients",
    description:
      "Manage onboarded clients, their assigned products, deal values, and tenant workspaces.",
    icon: Users,
    cta: "View Clients",
    available: true,
  },
  {
    href: "/crm/opportunities",
    label: "Opportunities",
    description:
      "Track deals in progress, manage your pipeline, and forecast revenue by stage.",
    icon: Briefcase,
    cta: "Coming Soon",
    available: false,
  },
] as const;

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Customer Relationships"
        description="Manage clients, sales pipeline, and opportunities across your entire customer lifecycle."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {CRM_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.href}
              className={
                section.available
                  ? "transition hover:border-white/20 hover:bg-slate-900/60"
                  : "opacity-50"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100">
                      {section.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {section.description}
                    </p>
                    {section.available ? (
                      <Link
                        href={section.href}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
                      >
                        {section.cta}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="mt-3 inline-flex text-xs text-slate-600">
                        {section.cta}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
