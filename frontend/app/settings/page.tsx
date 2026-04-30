"use client";

import { KeyRound, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace controls"
        description="Configure workspace identity, agent permissions, API keys, notification rules, and governance settings for the GridSphere operating system."
        action={
          <Button>
            <ShieldCheck className="h-4 w-4" />
            Save Settings
          </Button>
        }
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Workspace Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-slate-400">Workspace name</span>
              <Input defaultValue="GridSphere HQ" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-400">Primary region</span>
              <Input defaultValue="us-west-2" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-400">Billing email</span>
              <Input defaultValue="finance@gridsphere.local" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-400">Default product studio</span>
              <Input defaultValue="Venture Studio" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Posture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingRow icon={ShieldCheck} label="MFA" value="Required" />
            <SettingRow icon={KeyRound} label="API key rotation" value="30 days" />
            <SettingRow icon={Users} label="Admin seats" value="4 active" />
            <SettingRow icon={SlidersHorizontal} label="Agent permissions" value="Scoped" />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>AI Agent Governance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Governance label="Production deploys" value="Human approval required" />
          <Governance label="Finance actions" value="Read-only by default" />
          <Governance label="Customer outreach" value="Draft before send" />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-slate-950/35 p-3">
      <div className="flex items-center gap-2 text-sm text-slate-200">
        <Icon className="h-4 w-4 text-cyan-200" />
        {label}
      </div>
      <Badge tone="green">{value}</Badge>
    </div>
  );
}

function Governance({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/35 p-4">
      <p className="text-sm font-medium text-slate-100">{label}</p>
      <p className="mt-2 text-sm text-slate-500">{value}</p>
    </div>
  );
}
