"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Boxes,
  ChevronDown,
  Factory,
  Gauge,
  Landmark,
  LayoutDashboard,
  Network,
  Server,
  Settings,
  Tag,
  Users2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  // ── GridSphere Command Centre ──────────────────────────────────────────────
  {
    href: "/gridsphere",
    label: "Command Centre",
    icon: Network,
    children: [
      { href: "/gridsphere/dashboard", label: "Overview"  },
      { href: "/gridsphere/tenants",   label: "Tenants"   },
      { href: "/gridsphere/agents",    label: "AI Agents" },
    ],
  },
  // ── Products ────────────────────────────────────────────────────────────────
  {
    href: "/products",
    label: "Products",
    icon: Boxes,
    children: [
      { href: "/products/campusgrid", label: "CampusGrid" },
      { href: "/products/buildgrid",  label: "BuildGrid"  },
      { href: "/products/farmgrid",   label: "FarmGrid"   },
    ],
  },
  { href: "/product-factory", label: "Product Factory", icon: Factory },
  { href: "/ai-workforce",    label: "AI Workforce",    icon: Bot },
  { href: "/infrastructure",  label: "Infrastructure",  icon: Server },
  { href: "/finance",         label: "Finance",         icon: Landmark },
  { href: "/analytics",       label: "Analytics",       icon: BarChart3 },
  {
    href: "/crm",
    label: "CRM",
    icon: Users2,
    children: [
      { href: "/crm/clients",       label: "Clients" },
      { href: "/crm/opportunities", label: "Opportunities" },
    ],
  },
  { href: "/pricing",  label: "Pricing",  icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-50">GridSphere</p>
          <p className="text-xs text-slate-500">SaaS Mission Control</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} item={item} pathname={pathname} />
          ) : (
            <SidebarItem key={item.href} item={item} pathname={pathname} />
          )
        )}
      </nav>

      {/* Footer widget */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <p className="text-sm font-medium text-slate-100">AI Operating Mode</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            SalesAgent · DeploymentAgent · SupportAgent active. View runs in Command Centre.
          </p>
        </div>
      </div>
    </aside>
  );
}

// ── Flat link item ─────────────────────────────────────────────────────────────

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
        "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
        active && "bg-slate-900 text-cyan-300 ring-1 ring-white/10"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

// ── Expandable group item ──────────────────────────────────────────────────────

function SidebarGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const isExactParent = pathname === item.href;
  const hasActiveChild = item.children!.some(
    (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
  );
  const isHighlighted = isExactParent || hasActiveChild;

  const [open, setOpen] = useState(isHighlighted);
  const Icon = item.icon;

  // Auto-expand when navigating to a child route from elsewhere
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <div>
      {/* Parent row */}
      <div
        className={cn(
          "group flex h-10 items-center rounded-lg transition-colors hover:bg-slate-900",
          isExactParent && "bg-slate-900 ring-1 ring-white/10"
        )}
      >
        <Link
          href={item.href!}
          className="flex flex-1 items-center gap-3 px-3 h-full text-sm"
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isHighlighted
                ? "text-cyan-300"
                : "text-slate-400 group-hover:text-slate-100"
            )}
          />
          <span
            className={cn(
              "transition-colors",
              isHighlighted
                ? "text-cyan-300"
                : "text-slate-400 group-hover:text-slate-100"
            )}
          >
            {item.label}
          </span>
        </Link>

        {/* Chevron toggle — only toggles, does not navigate */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse" : "Expand"}
          className={cn(
            "flex h-full items-center px-3 transition-colors",
            isHighlighted
              ? "text-cyan-300"
              : "text-slate-500 group-hover:text-slate-400"
          )}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </button>
      </div>

      {/* Animated children list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-[1.6rem] mt-0.5 space-y-0.5 border-l border-white/10 pl-3 pb-1">
              {item.children!.map((child) => (
                <SidebarSubItem
                  key={child.href}
                  child={child}
                  pathname={pathname}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Indented child link ────────────────────────────────────────────────────────

function SidebarSubItem({
  child,
  pathname,
}: {
  child: { href: string; label: string };
  pathname: string;
}) {
  const active =
    pathname === child.href || pathname.startsWith(`${child.href}/`);

  return (
    <Link
      href={child.href}
      className={cn(
        "flex h-8 items-center rounded-md px-3 text-xs transition-colors",
        "text-slate-500 hover:bg-slate-900 hover:text-slate-200",
        active && "bg-slate-900 text-cyan-300 ring-1 ring-white/10"
      )}
    >
      {child.label}
    </Link>
  );
}
