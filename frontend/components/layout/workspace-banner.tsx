"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

type WorkspaceBannerProps = {
  hqUrl: string;
  accentClass?: string;
};

export function WorkspaceBanner({ hqUrl, accentClass = "amber" }: WorkspaceBannerProps) {
  const { tenantName, tenantId, exitWorkspace } = useWorkspaceStore();
  const searchParams = useSearchParams();
  const resolvedTenantId = searchParams.get("tenant_id") ?? tenantId ?? "unknown";
  const displayName = tenantName ?? resolvedTenantId;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
        "border-amber-400/20 bg-amber-400/5"
      )}
    >
      <div className="flex items-center gap-2 text-amber-400">
        <Building2 className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Tenant Workspace</span>
      </div>

      <span className="text-slate-600">·</span>

      <span className="font-medium text-slate-100">{displayName}</span>

      <span className="rounded-full border border-white/10 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-500">
        {resolvedTenantId}
      </span>

      <Link
        href={hqUrl}
        onClick={exitWorkspace}
        className="ml-auto flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to HQ
      </Link>
    </div>
  );
}
