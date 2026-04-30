import { Badge } from "@/components/ui/badge";
import type { Status } from "@/types";

const statusTone: Record<Status, "green" | "amber" | "red" | "cyan" | "default"> = {
  healthy: "green",
  warning: "amber",
  critical: "red",
  deployed: "green",
  building: "cyan",
  paused: "default"
};

export function StatusPill({ status }: { status: Status }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
}
