"use client";

import { Bell, ChevronDown, Command, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl lg:pl-[19rem]">
      <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 flex-1 items-center md:flex">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input className="pl-10 pr-20" placeholder="Search products, agents, deployments..." />
          <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-white/10 px-2 py-1 text-xs text-slate-500 lg:flex">
            <Command className="h-3 w-3" />
            K
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button size="icon" variant="ghost" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="hidden gap-3 sm:flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
            GS
          </span>
          Admin
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </Button>
      </div>
    </header>
  );
}
