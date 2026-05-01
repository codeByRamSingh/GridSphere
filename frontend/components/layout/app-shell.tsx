"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, navItems } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mesh-grid bg-[size:48px_48px]">
      <Sidebar />
      <TopNav />
      <MobileNav />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="px-4 py-6 lg:pl-[19rem]"
      >
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
      </motion.main>
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();

  // Flatten for mobile strip: groups show parent link + children (using parent icon)
  const flatItems = navItems.flatMap((item) => {
    if (item.children) {
      return [
        ...(item.href ? [{ href: item.href, label: item.label, icon: item.icon }] : []),
        ...item.children.map((child) => ({ href: child.href, label: child.label, icon: item.icon })),
      ];
    }
    return item.href ? [{ href: item.href, label: item.label, icon: item.icon }] : [];
  });

  return (
    <nav className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b border-white/10 bg-slate-950/70 px-4 py-2 backdrop-blur-xl lg:hidden">
      {flatItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-9 shrink-0 items-center gap-2 rounded-md border border-transparent px-3 text-xs text-slate-400",
              active && "border-white/10 bg-slate-900 text-cyan-100"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
