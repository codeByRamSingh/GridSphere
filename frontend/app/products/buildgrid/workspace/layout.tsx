"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HardHat } from "lucide-react";
import { WorkspaceBanner } from "@/components/layout/workspace-banner";
import { cn } from "@/lib/utils";
import { getProductConfig } from "@/lib/product-registry";

const config = getProductConfig("buildgrid")!;

function WorkspaceLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id") ?? "";

  function moduleHref(href: string) {
    return `/products/buildgrid/workspace/${href}${tenantId ? `?tenant_id=${tenantId}` : ""}`;
  }

  return (
    <div className="space-y-4">
      {/* Module header */}
      <div className="flex items-center gap-3 border-b border-white/8 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
          <HardHat className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Products · Construction ERP</p>
          <p className="text-sm font-semibold text-slate-100">BuildGrid</p>
        </div>
        <span className="ml-3 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
          Tenant Workspace
        </span>
      </div>

      {/* Tenant context banner */}
      <WorkspaceBanner hqUrl={config.hqUrl} />

      {/* ERP sub-nav */}
      <nav className="flex gap-0.5 overflow-x-auto border-b border-white/8">
        {config.erpModules.map((mod) => {
          const href = moduleHref(mod.href);
          const active =
            pathname === `/products/buildgrid/workspace/${mod.href}` ||
            pathname.startsWith(`/products/buildgrid/workspace/${mod.href}/`);
          return (
            <Link
              key={mod.href}
              href={mod.live ? href : "#"}
              className={cn(
                "flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-4 text-sm transition-colors",
                active
                  ? "border-cyan-400 text-cyan-300"
                  : mod.live
                  ? "border-transparent text-slate-500 hover:text-slate-300"
                  : "cursor-not-allowed border-transparent text-slate-700"
              )}
            >
              {mod.label}
              {!mod.live && (
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600">
                  soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}

export default function BuildGridWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <WorkspaceLayoutInner>{children}</WorkspaceLayoutInner>
    </Suspense>
  );
}
