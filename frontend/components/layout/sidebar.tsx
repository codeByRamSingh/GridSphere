"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Boxes,
  Factory,
  Gauge,
  Landmark,
  LayoutDashboard,
  Server,
  Settings,
  Tag,
  Users2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/product-factory", label: "Product Factory", icon: Factory },
  { href: "/ai-workforce", label: "AI Workforce", icon: Bot },
  { href: "/infrastructure", label: "Infrastructure", icon: Server },
  { href: "/finance", label: "Finance", icon: Landmark },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  {
    label: "CRM",
    icon: Users2,
    children: [
      { href: "/crm/clients", label: "Clients" },
    ],
  },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-50">GridSphere</p>
          <p className="text-xs text-slate-500">SaaS Mission Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          if (item.children) {
            const groupActive = item.children.some((c) => pathname.startsWith(c.href));
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <div
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-slate-400",
                    groupActive && "text-cyan-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex h-9 items-center rounded-md px-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-100",
                          childActive && "bg-slate-900 text-cyan-100 ring-1 ring-white/10"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-100",
                active && "bg-slate-900 text-cyan-100 ring-1 ring-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4">
          <p className="text-sm font-medium text-slate-100">AI Operating Mode</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            8 agents are coordinating product, infrastructure, and finance workloads.
          </p>
        </div>
      </div>
    </aside>
  );
}
