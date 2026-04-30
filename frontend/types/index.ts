import type { LucideIcon } from "lucide-react";

export type Status = "healthy" | "warning" | "critical" | "deployed" | "building" | "paused";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  market: string;
  stage: "Ideation" | "MVP" | "Beta" | "Growth" | "Scale";
  revenue: number;
  activeUsers: number;
  growth: number;
  openBugs: number;
  deploymentStatus: Status;
  health: number;
  owner: string;
  nextMilestone: string;
  mrrSeries: ChartPoint[];
  adoption: ChartPoint[];
  customers: ProductCustomer[];
  roadmap: ProductRoadmapItem[];
  deployments: ProductDeployment[];
  usage: ProductUsageMetric[];
  supportTickets: ProductSupportTicket[];
};

export type ProductCustomer = {
  name: string;
  segment: string;
  region: string;
  seats: number;
  health: number;
  mrr: number;
};

export type ProductRoadmapItem = {
  title: string;
  status: "Discovery" | "Build" | "Testing" | "Launch";
  eta: string;
  owner: string;
};

export type ProductDeployment = {
  service: string;
  version: string;
  region: string;
  status: Status;
  updatedAt: string;
};

export type ProductUsageMetric = {
  name: string;
  value: string;
  change: string;
};

export type ProductSupportTicket = {
  id: string;
  customer: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  title: string;
  status: "Open" | "In progress" | "Resolved";
};

export type ChartPoint = {
  name: string;
  value?: number;
  revenue?: number;
  expenses?: number;
  customers?: number;
  products?: number;
  buildGrid?: number;
  campusGrid?: number;
  farmGrid?: number;
};

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: "cyan" | "green" | "amber" | "red" | "violet" | "slate";
  icon: LucideIcon;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "deployment" | "launch" | "agent" | "customer" | "finance";
};

export type FactoryStage =
  | "Ideas"
  | "Research"
  | "Validation"
  | "MVP"
  | "Development"
  | "Testing"
  | "Launch"
  | "Scale";

export type ProductIdea = {
  id: string;
  title: string;
  stage: FactoryStage;
  marketSize: string;
  estimatedRevenue: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  assignedTeam: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  currentTask: string;
  status: "Running" | "Reviewing" | "Idle" | "Blocked";
  tokenCost: number;
  completedTasks: number;
  efficiency: number;
};

export type AgentLog = {
  id: string;
  agent: string;
  event: string;
  time: string;
  severity: "info" | "success" | "warning";
};

export type GlobalRegion = {
  name: string;
  customers: number;
  deployments: number;
  products: string[];
  revenue: number;
  x: number;
  y: number;
  intensity: number;
  status: "healthy" | "watch" | "expanding";
};

export type CommandAlert = {
  id: string;
  category: "Product" | "Infrastructure" | "Churn" | "AI" | "Finance";
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  product: string;
  owner: string;
  time: string;
  action: string;
};

export type AgentWorkflowNode = {
  id: string;
  step: string;
  agent: string;
  status: "Running" | "Reviewing" | "Queued" | "Blocked" | "Ready";
  task: string;
  handoff: string;
};

export type PhaseTwoConnector = {
  name: string;
  status: "connected" | "ready" | "needs setup";
  description: string;
  lastSync: string;
};

export type NavItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string }[];
};

// ── Pricing ──────────────────────────────────────────────────────────────────

export type Plan = {
  id: number;
  name: "Basic" | "Pro" | "Enterprise";
  priceMonthly: number;
  priceAnnual: number;
  maxSeats: number;
  maxProducts: number;
  features: string[];
  savingsPercent: number;
};

// ── CRM ──────────────────────────────────────────────────────────────────────

export type OnboardingStatus = "draft" | "provisioning" | "active" | "suspended" | "churned";

export type ClientProduct = {
  id: number;
  productSlug: string;
  provisioned: boolean;
  enabledModules: string[];
};

export type ClientUser = {
  id: number;
  email: string;
  role: "admin" | "manager" | "viewer";
  invited: boolean;
  accepted: boolean;
};

export type Client = {
  id: number;
  name: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  tenantId: string;
  planId: number | null;
  planName: string | null;
  region: string;
  dealValue: number;
  portalEnabled: boolean;
  onboardingStatus: OnboardingStatus;
  accountManagerId: number | null;
  notes: string;
  tags: string[];
  products: ClientProduct[];
  users: ClientUser[];
  createdAt: string;
};
