import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        default: "border-slate-700 bg-slate-900/70 text-slate-300",
        cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
        green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
        amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
        red: "border-red-400/25 bg-red-400/10 text-red-200",
        violet: "border-violet-400/25 bg-violet-400/10 text-violet-200"
      }
    },
    defaultVariants: {
      tone: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ tone }), className)} {...props} />;
}
