import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types";

const activityTone: Record<Activity["type"], "cyan" | "green" | "amber" | "violet" | "default"> = {
  deployment: "cyan",
  launch: "violet",
  agent: "green",
  customer: "amber",
  finance: "default"
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0">
            <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.45)]" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-100">{activity.title}</p>
                <Badge tone={activityTone[activity.type]}>{activity.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
              <p className="mt-2 text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
