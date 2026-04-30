import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, Rocket, Send } from "lucide-react";

const icons = [Rocket, Bot, Send, FileText];

export function QuickActions({ actions }: { actions: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => {
          const Icon = icons[index] ?? Rocket;

          return (
            <Button key={action} variant={index === 0 ? "default" : "outline"} className="justify-start">
              <Icon className="h-4 w-4" />
              {action}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
