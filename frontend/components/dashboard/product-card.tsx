import Link from "next/link";
import { ArrowRight, Bug, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full transition hover:border-cyan-300/30 hover:shadow-glow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-400">{product.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{product.stage}</Badge>
            <StatusPill status={product.deploymentStatus} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Revenue" value={formatCurrency(product.revenue)} />
            <Metric label="Users" value={formatNumber(product.activeUsers)} icon={Users} />
            <Metric label="Growth" value={formatPercent(product.growth)} icon={TrendingUp} />
            <Metric label="Open bugs" value={String(product.openBugs)} icon={Bug} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Product health</span>
              <span>{product.health}%</span>
            </div>
            <Progress value={product.health} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Metric({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/30 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </div>
      <p className="mt-2 font-medium text-slate-100">{value}</p>
    </div>
  );
}
