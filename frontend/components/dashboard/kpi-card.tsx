import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types";

const toneRing: Record<Kpi["tone"], string> = {
  cyan: "bg-cyan-400/10 text-cyan-200 ring-cyan-400/20",
  green: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20",
  amber: "bg-amber-400/10 text-amber-200 ring-amber-400/20",
  red: "bg-red-400/10 text-red-200 ring-red-400/20",
  violet: "bg-violet-400/10 text-violet-200 ring-violet-400/20",
  slate: "bg-slate-700/40 text-slate-200 ring-slate-500/20"
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{kpi.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-50">{kpi.value}</p>
          </div>
          <div className={cn("rounded-md p-2 ring-1", toneRing[kpi.tone])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">{kpi.delta}</p>
      </CardContent>
    </Card>
  );
}
