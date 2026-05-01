"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM · Opportunities"
        title="Opportunities"
        description="Track deals in progress and manage your sales pipeline."
      />

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900">
          <Briefcase className="h-6 w-6 text-slate-500" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-300">Coming Soon</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Pipeline tracking, deal stages, and revenue forecasting are on the roadmap.
        </p>
        <Link href="/crm" className="mt-6">
          <Button variant="outline" className="text-sm">
            Back to CRM
          </Button>
        </Link>
      </div>
    </div>
  );
}
