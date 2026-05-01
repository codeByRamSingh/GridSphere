"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const HQ_NAV = [
  { href: "/products/buildgrid/dashboard", label: "Overview"  },
  { href: "/products/buildgrid/clients",   label: "Clients"   },
  { href: "/products/buildgrid/analytics", label: "Analytics" },
] as const;

export default function BuildGridHQLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Workspace sub-tree renders its own layout — this shell is HQ-only
  const isWorkspace = pathname.startsWith("/products/buildgrid/workspace");
  if (isWorkspace) return <>{children}</>;

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="flex items-center gap-3 border-b border-white/8 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
          <HardHat className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Products · Construction ERP</p>
          <p className="text-sm font-semibold text-slate-100">BuildGrid</p>
        </div>
        <span className="ml-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
          HQ View
        </span>
      </div>

      {/* HQ sub-nav */}
      <nav className="-mt-3 flex gap-0.5 overflow-x-auto border-b border-white/8">
        {HQ_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-4 text-sm transition-colors",
                active
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
