import {
  Activity,
  Agent,
  AgentWorkflowNode,
  AgentLog,
  ChartPoint,
  Client,
  CommandAlert,
  GlobalRegion,
  PhaseTwoConnector,
  Kpi,
  Plan,
  Product,
  ProductIdea
} from "@/types";
import {
  AlertTriangle,
  Bot,
  Boxes,
  DollarSign,
  HeartPulse,
  Users
} from "lucide-react";

export const products: Product[] = [
  {
    id: "prod_buildgrid",
    slug: "buildgrid",
    name: "BuildGrid",
    description: "Interior and construction ERP for projects, procurement, contractors, and site execution.",
    market: "Construction operations",
    stage: "Growth",
    revenue: 84200,
    activeUsers: 1284,
    growth: 18.4,
    openBugs: 14,
    deploymentStatus: "deployed",
    health: 93,
    owner: "GridSphere Construction Studio",
    nextMilestone: "Vendor payments automation",
    mrrSeries: [
      { name: "Jan", revenue: 52000 },
      { name: "Feb", revenue: 59000 },
      { name: "Mar", revenue: 64000 },
      { name: "Apr", revenue: 70500 },
      { name: "May", revenue: 78200 },
      { name: "Jun", revenue: 84200 }
    ],
    adoption: [
      { name: "Estimating", value: 84 },
      { name: "Projects", value: 92 },
      { name: "Inventory", value: 61 },
      { name: "Finance", value: 58 }
    ],
    customers: [
      { name: "Apex Interiors", segment: "Enterprise GC", region: "North America", seats: 312, health: 96, mrr: 18400 },
      { name: "MetroBuild Group", segment: "Regional contractor", region: "Europe", seats: 228, health: 91, mrr: 14200 },
      { name: "Stoneworks Design", segment: "Specialty trade", region: "North America", seats: 84, health: 88, mrr: 5200 }
    ],
    roadmap: [
      { title: "Vendor payments automation", status: "Build", eta: "May 2026", owner: "BuildGrid Core" },
      { title: "AI change-order estimator", status: "Testing", eta: "June 2026", owner: "AI Engineer" },
      { title: "Subcontractor mobile approvals", status: "Discovery", eta: "July 2026", owner: "AI PM" }
    ],
    deployments: [
      { service: "buildgrid-api", version: "v2.8.4", region: "us-east", status: "deployed", updatedAt: "8 min ago" },
      { service: "buildgrid-worker", version: "v2.8.2", region: "eu-west", status: "deployed", updatedAt: "34 min ago" },
      { service: "buildgrid-web", version: "v2.8.4", region: "global edge", status: "deployed", updatedAt: "1 hr ago" }
    ],
    usage: [
      { name: "Projects managed", value: "14.8K", change: "+18% MoM" },
      { name: "Purchase orders", value: "42.1K", change: "+11% MoM" },
      { name: "AI estimates", value: "6.4K", change: "+27% MoM" }
    ],
    supportTickets: [
      { id: "BG-1842", customer: "Apex Interiors", priority: "High", title: "Approval workflow latency", status: "In progress" },
      { id: "BG-1837", customer: "MetroBuild Group", priority: "Medium", title: "Invoice export mapping", status: "Open" },
      { id: "BG-1829", customer: "Stoneworks Design", priority: "Low", title: "Mobile punch-list photo upload", status: "Resolved" }
    ]
  },
  {
    id: "prod_campusgrid",
    slug: "campusgrid",
    name: "CampusGrid",
    description: "Education ERP for admissions, learning operations, staff workflows, and student lifecycle.",
    market: "Education administration",
    stage: "Beta",
    revenue: 38400,
    activeUsers: 742,
    growth: 12.7,
    openBugs: 9,
    deploymentStatus: "building",
    health: 86,
    owner: "GridSphere Education Studio",
    nextMilestone: "Parent communication portal",
    mrrSeries: [
      { name: "Jan", revenue: 18000 },
      { name: "Feb", revenue: 21100 },
      { name: "Mar", revenue: 24800 },
      { name: "Apr", revenue: 29400 },
      { name: "May", revenue: 33200 },
      { name: "Jun", revenue: 38400 }
    ],
    adoption: [
      { name: "Admissions", value: 74 },
      { name: "Academics", value: 67 },
      { name: "Billing", value: 52 },
      { name: "Reports", value: 49 }
    ],
    customers: [
      { name: "North Valley Academy", segment: "K-12 network", region: "North America", seats: 580, health: 89, mrr: 11800 },
      { name: "Lumen College", segment: "Higher education", region: "Europe", seats: 420, health: 84, mrr: 9300 },
      { name: "BrightPath Schools", segment: "Private school group", region: "Asia Pacific", seats: 260, health: 82, mrr: 6700 }
    ],
    roadmap: [
      { title: "Parent communication portal", status: "Build", eta: "May 2026", owner: "Education Studio" },
      { title: "AI registrar assistant", status: "Testing", eta: "June 2026", owner: "AI Product Manager" },
      { title: "Tuition collections automation", status: "Discovery", eta: "July 2026", owner: "AI Finance Agent" }
    ],
    deployments: [
      { service: "campusgrid-worker", version: "v1.4.1", region: "us-east", status: "building", updatedAt: "19 min ago" },
      { service: "campusgrid-api", version: "v1.4.0", region: "eu-west", status: "deployed", updatedAt: "46 min ago" },
      { service: "campusgrid-billing", version: "v1.3.8", region: "global edge", status: "warning", updatedAt: "2 hrs ago" }
    ],
    usage: [
      { name: "Student records", value: "31.2K", change: "+14% MoM" },
      { name: "Admissions tasks", value: "8.9K", change: "+22% MoM" },
      { name: "Billing events", value: "12.4K", change: "+9% MoM" }
    ],
    supportTickets: [
      { id: "CG-912", customer: "North Valley Academy", priority: "High", title: "Billing queue duplicate retry", status: "In progress" },
      { id: "CG-905", customer: "Lumen College", priority: "Medium", title: "Transcript template request", status: "Open" },
      { id: "CG-899", customer: "BrightPath Schools", priority: "Low", title: "Staff permission clarification", status: "Resolved" }
    ]
  },
  {
    id: "prod_farmgrid",
    slug: "farmgrid",
    name: "FarmGrid",
    description: "Smart agriculture ERP for crop plans, field telemetry, resource usage, and farm profitability.",
    market: "Agri-tech operations",
    stage: "MVP",
    revenue: 16400,
    activeUsers: 318,
    growth: 28.9,
    openBugs: 21,
    deploymentStatus: "warning",
    health: 78,
    owner: "GridSphere Agriculture Studio",
    nextMilestone: "IoT irrigation dashboard",
    mrrSeries: [
      { name: "Jan", revenue: 4200 },
      { name: "Feb", revenue: 6100 },
      { name: "Mar", revenue: 8500 },
      { name: "Apr", revenue: 11100 },
      { name: "May", revenue: 13900 },
      { name: "Jun", revenue: 16400 }
    ],
    adoption: [
      { name: "Crop Plans", value: 71 },
      { name: "Sensors", value: 43 },
      { name: "Inventory", value: 38 },
      { name: "Finance", value: 31 }
    ],
    customers: [
      { name: "Sunfield Co-op", segment: "Agriculture co-op", region: "North America", seats: 96, health: 80, mrr: 4200 },
      { name: "Ridge Acre Farms", segment: "Commercial farm", region: "LATAM", seats: 64, health: 76, mrr: 3100 },
      { name: "GreenRow Produce", segment: "Controlled environment", region: "Asia Pacific", seats: 52, health: 73, mrr: 2600 }
    ],
    roadmap: [
      { title: "IoT irrigation dashboard", status: "Build", eta: "May 2026", owner: "Agriculture Studio" },
      { title: "Soil intelligence model", status: "Testing", eta: "June 2026", owner: "AI Engineer" },
      { title: "Field profitability forecast", status: "Discovery", eta: "August 2026", owner: "AI Finance Agent" }
    ],
    deployments: [
      { service: "farmgrid-edge", version: "v0.8.6", region: "us-west", status: "warning", updatedAt: "22 min ago" },
      { service: "farmgrid-api", version: "v0.8.5", region: "us-east", status: "deployed", updatedAt: "1 hr ago" },
      { service: "farmgrid-telemetry", version: "v0.8.3", region: "ap-south", status: "building", updatedAt: "3 hrs ago" }
    ],
    usage: [
      { name: "Sensor events", value: "3.1M", change: "+31% MoM" },
      { name: "Crop plans", value: "1.7K", change: "+16% MoM" },
      { name: "Irrigation runs", value: "9.2K", change: "+24% MoM" }
    ],
    supportTickets: [
      { id: "FG-422", customer: "Sunfield Co-op", priority: "Critical", title: "Sensor sync gap on edge gateway", status: "Open" },
      { id: "FG-417", customer: "Ridge Acre Farms", priority: "High", title: "Moisture alert threshold tuning", status: "In progress" },
      { id: "FG-408", customer: "GreenRow Produce", priority: "Medium", title: "Inventory variance report", status: "Resolved" }
    ]
  }
];

export const executiveKpis: Kpi[] = [
  {
    label: "Total MRR",
    value: "$139K",
    delta: "+17.6% vs last month",
    tone: "cyan",
    icon: DollarSign
  },
  {
    label: "Active Customers",
    value: "2,344",
    delta: "+214 net new",
    tone: "green",
    icon: Users
  },
  {
    label: "Active Products",
    value: "3",
    delta: "2 in build pipeline",
    tone: "violet",
    icon: Boxes
  },
  {
    label: "Active AI Agents",
    value: "8",
    delta: "91% avg efficiency",
    tone: "slate",
    icon: Bot
  },
  {
    label: "Infrastructure Health",
    value: "94%",
    delta: "All critical systems live",
    tone: "green",
    icon: HeartPulse
  },
  {
    label: "Open Critical Tasks",
    value: "7",
    delta: "3 require human review",
    tone: "amber",
    icon: AlertTriangle
  }
];

export const revenueGrowth: ChartPoint[] = [
  { name: "Jan", revenue: 74200, customers: 1190 },
  { name: "Feb", revenue: 86200, customers: 1358 },
  { name: "Mar", revenue: 97300, customers: 1542 },
  { name: "Apr", revenue: 111000, customers: 1810 },
  { name: "May", revenue: 125300, customers: 2130 },
  { name: "Jun", revenue: 139000, customers: 2344 }
];

export const productGrowth: ChartPoint[] = [
  { name: "Jan", buildGrid: 52, campusGrid: 18, farmGrid: 4 },
  { name: "Feb", buildGrid: 59, campusGrid: 21, farmGrid: 6 },
  { name: "Mar", buildGrid: 64, campusGrid: 25, farmGrid: 9 },
  { name: "Apr", buildGrid: 71, campusGrid: 29, farmGrid: 11 },
  { name: "May", buildGrid: 78, campusGrid: 33, farmGrid: 14 },
  { name: "Jun", buildGrid: 84, campusGrid: 38, farmGrid: 16 }
];

export const monthlyExpenses: ChartPoint[] = [
  { name: "Jan", expenses: 41200 },
  { name: "Feb", expenses: 43800 },
  { name: "Mar", expenses: 46900 },
  { name: "Apr", expenses: 51600 },
  { name: "May", expenses: 54200 },
  { name: "Jun", expenses: 58800 }
];

export const activities: Activity[] = [
  {
    id: "act_1",
    title: "BuildGrid production deploy completed",
    description: "v2.8.4 shipped procurement approvals and site issue triage.",
    time: "8 min ago",
    type: "deployment"
  },
  {
    id: "act_2",
    title: "AI Product Manager closed discovery batch",
    description: "Synthesized 46 calls into 11 roadmap opportunities.",
    time: "24 min ago",
    type: "agent"
  },
  {
    id: "act_3",
    title: "CampusGrid signed pilot customer",
    description: "North Valley Academy added 580 student seats.",
    time: "1 hr ago",
    type: "customer"
  },
  {
    id: "act_4",
    title: "FarmGrid sensor module entered testing",
    description: "Edge telemetry sync validated across three farms.",
    time: "2 hrs ago",
    type: "launch"
  },
  {
    id: "act_5",
    title: "Finance agent flagged cloud spend drift",
    description: "GPU inference workloads are 12% above forecast.",
    time: "3 hrs ago",
    type: "finance"
  }
];

export const quickActions = [
  "Launch New Startup",
  "Launch MVP",
  "Assign AI Swarm",
  "Generate GTM Strategy",
  "Deploy New Infra",
  "Run Churn Analysis"
];

export const globalRegions: GlobalRegion[] = [
  {
    name: "North America",
    customers: 1248,
    deployments: 18,
    products: ["BuildGrid", "CampusGrid", "FarmGrid"],
    revenue: 84600,
    x: 24,
    y: 35,
    intensity: 96,
    status: "healthy"
  },
  {
    name: "Europe",
    customers: 516,
    deployments: 9,
    products: ["BuildGrid", "CampusGrid"],
    revenue: 32600,
    x: 49,
    y: 31,
    intensity: 68,
    status: "expanding"
  },
  {
    name: "Asia Pacific",
    customers: 422,
    deployments: 7,
    products: ["CampusGrid", "FarmGrid"],
    revenue: 21800,
    x: 73,
    y: 46,
    intensity: 52,
    status: "expanding"
  },
  {
    name: "Middle East",
    customers: 92,
    deployments: 3,
    products: ["BuildGrid"],
    revenue: 7100,
    x: 58,
    y: 45,
    intensity: 34,
    status: "watch"
  },
  {
    name: "LATAM",
    customers: 66,
    deployments: 2,
    products: ["FarmGrid"],
    revenue: 4900,
    x: 34,
    y: 66,
    intensity: 27,
    status: "watch"
  }
];

export const commandAlerts: CommandAlert[] = [
  {
    id: "alert_product_1",
    category: "Product",
    title: "FarmGrid telemetry ingestion degraded",
    description: "Edge gateways in two LATAM fields missed three sync windows.",
    severity: "critical",
    product: "FarmGrid",
    owner: "AI CTO",
    time: "6 min ago",
    action: "Open incident"
  },
  {
    id: "alert_infra_1",
    category: "Infrastructure",
    title: "GPU queue pressure above policy",
    description: "Inference workloads exceeded 70% for 18 minutes during agent evals.",
    severity: "warning",
    product: "GridSphere Core",
    owner: "AI Engineer",
    time: "17 min ago",
    action: "Scale workers"
  },
  {
    id: "alert_churn_1",
    category: "Churn",
    title: "CampusGrid pilot churn risk spike",
    description: "Two education pilots dropped below 60% weekly active staff usage.",
    severity: "warning",
    product: "CampusGrid",
    owner: "AI Support Agent",
    time: "31 min ago",
    action: "Run playbook"
  },
  {
    id: "alert_ai_1",
    category: "AI",
    title: "Support agent blocked on missing policy",
    description: "Refund and credit approval rules need human review before outreach.",
    severity: "info",
    product: "All Products",
    owner: "Human operator",
    time: "44 min ago",
    action: "Approve policy"
  },
  {
    id: "alert_finance_1",
    category: "Finance",
    title: "Cloud spend drift above forecast",
    description: "AI/API expense is 12% above plan after local model fallback failed.",
    severity: "warning",
    product: "GridSphere Core",
    owner: "AI Finance Agent",
    time: "1 hr ago",
    action: "Review spend"
  }
];

export const factoryStages: ProductIdea["stage"][] = [
  "Ideas",
  "Research",
  "Validation",
  "MVP",
  "Development",
  "Testing",
  "Launch",
  "Scale"
];

export const productIdeas: ProductIdea[] = [
  {
    id: "idea_1",
    title: "ClinicGrid",
    stage: "Ideas",
    marketSize: "$28B",
    estimatedRevenue: "$1.8M ARR",
    category: "Healthcare operations",
    priority: "High",
    assignedTeam: "Venture Studio"
  },
  {
    id: "idea_2",
    title: "LegalGrid",
    stage: "Research",
    marketSize: "$19B",
    estimatedRevenue: "$950K ARR",
    category: "Legal workflow",
    priority: "Medium",
    assignedTeam: "AI PM + Sales"
  },
  {
    id: "idea_3",
    title: "LogisticsGrid",
    stage: "Validation",
    marketSize: "$44B",
    estimatedRevenue: "$2.4M ARR",
    category: "Supply chain",
    priority: "High",
    assignedTeam: "CTO Office"
  },
  {
    id: "idea_4",
    title: "BuildGrid Vendor Wallet",
    stage: "MVP",
    marketSize: "$7B",
    estimatedRevenue: "$620K ARR",
    category: "FinOps add-on",
    priority: "High",
    assignedTeam: "BuildGrid Core"
  },
  {
    id: "idea_5",
    title: "CampusGrid AI Registrar",
    stage: "Development",
    marketSize: "$5B",
    estimatedRevenue: "$410K ARR",
    category: "Education AI",
    priority: "Medium",
    assignedTeam: "Education Studio"
  },
  {
    id: "idea_6",
    title: "FarmGrid Soil Intelligence",
    stage: "Testing",
    marketSize: "$12B",
    estimatedRevenue: "$780K ARR",
    category: "Agri telemetry",
    priority: "Medium",
    assignedTeam: "Agriculture Studio"
  },
  {
    id: "idea_7",
    title: "GridSphere Partner Portal",
    stage: "Launch",
    marketSize: "$3B",
    estimatedRevenue: "$300K ARR",
    category: "Ecosystem",
    priority: "Low",
    assignedTeam: "Growth"
  },
  {
    id: "idea_8",
    title: "BuildGrid AI Estimator",
    stage: "Scale",
    marketSize: "$11B",
    estimatedRevenue: "$1.2M ARR",
    category: "Construction AI",
    priority: "High",
    assignedTeam: "AI Workforce"
  }
];

export const agents: Agent[] = [
  {
    id: "agent_ceo",
    name: "AI CEO",
    role: "Strategy orchestration",
    currentTask: "Prioritize Q3 capital allocation across SaaS lines",
    status: "Reviewing",
    tokenCost: 184.2,
    completedTasks: 128,
    efficiency: 94
  },
  {
    id: "agent_cto",
    name: "AI CTO",
    role: "Architecture and reliability",
    currentTask: "Design local LLM cluster failover policy",
    status: "Running",
    tokenCost: 243.7,
    completedTasks: 211,
    efficiency: 91
  },
  {
    id: "agent_pm",
    name: "AI Product Manager",
    role: "Research and roadmap",
    currentTask: "Score FarmGrid sensor dashboard requirements",
    status: "Running",
    tokenCost: 122.8,
    completedTasks: 389,
    efficiency: 96
  },
  {
    id: "agent_engineer",
    name: "AI Engineer",
    role: "Implementation",
    currentTask: "Generate CampusGrid billing API tests",
    status: "Running",
    tokenCost: 318.6,
    completedTasks: 542,
    efficiency: 89
  },
  {
    id: "agent_marketing",
    name: "AI Marketing Agent",
    role: "Campaign systems",
    currentTask: "Prepare BuildGrid contractor nurture sequence",
    status: "Idle",
    tokenCost: 76.5,
    completedTasks: 166,
    efficiency: 87
  },
  {
    id: "agent_sales",
    name: "AI Sales Agent",
    role: "Pipeline support",
    currentTask: "Qualify 43 education ERP leads",
    status: "Running",
    tokenCost: 98.1,
    completedTasks: 274,
    efficiency: 93
  },
  {
    id: "agent_finance",
    name: "AI Finance Agent",
    role: "Forecasting and control",
    currentTask: "Reconcile cloud spend against product P&L",
    status: "Reviewing",
    tokenCost: 64.9,
    completedTasks: 197,
    efficiency: 92
  },
  {
    id: "agent_support",
    name: "AI Support Agent",
    role: "Customer operations",
    currentTask: "Cluster support tickets by product health impact",
    status: "Blocked",
    tokenCost: 55.4,
    completedTasks: 431,
    efficiency: 78
  }
];

export const agentWorkflow: AgentWorkflowNode[] = [
  {
    id: "ceo",
    step: "CEO",
    agent: "AI CEO",
    status: "Reviewing",
    task: "Choose the highest-leverage startup or product bet",
    handoff: "Capital allocation and strategy brief"
  },
  {
    id: "cto",
    step: "CTO",
    agent: "AI CTO",
    status: "Running",
    task: "Translate the strategy into architecture and risk controls",
    handoff: "System blueprint and platform constraints"
  },
  {
    id: "pm",
    step: "PM",
    agent: "AI Product Manager",
    status: "Running",
    task: "Convert research into requirements and MVP scope",
    handoff: "Roadmap, acceptance criteria, and customer jobs"
  },
  {
    id: "engineer",
    step: "Engineer",
    agent: "AI Engineer",
    status: "Running",
    task: "Generate implementation tasks, API contracts, and tests",
    handoff: "Pull request plan and migration checklist"
  },
  {
    id: "qa",
    step: "QA",
    agent: "AI QA Agent",
    status: "Queued",
    task: "Run regression, security, and customer workflow checks",
    handoff: "Release confidence score and blocking defects"
  },
  {
    id: "deploy",
    step: "Deploy",
    agent: "Deploy Gate",
    status: "Ready",
    task: "Ship approved builds through infrastructure guardrails",
    handoff: "Production rollout and post-launch monitors"
  }
];

export const agentLogs: AgentLog[] = [
  {
    id: "log_1",
    agent: "AI Engineer",
    event: "Generated regression test matrix for CampusGrid billing workflows.",
    time: "5 min ago",
    severity: "success"
  },
  {
    id: "log_2",
    agent: "AI CTO",
    event: "Raised warning on GPU queue saturation during nightly model evaluation.",
    time: "17 min ago",
    severity: "warning"
  },
  {
    id: "log_3",
    agent: "AI Sales Agent",
    event: "Qualified 12 new BuildGrid leads from partner channel.",
    time: "36 min ago",
    severity: "info"
  },
  {
    id: "log_4",
    agent: "AI Finance Agent",
    event: "Updated cash runway model with June infrastructure invoices.",
    time: "51 min ago",
    severity: "success"
  }
];

export const infrastructureMetrics = [
  { label: "Server uptime", value: "99.98%", progress: 99, status: "healthy" },
  { label: "Docker containers", value: "42 running", progress: 88, status: "healthy" },
  { label: "API usage", value: "8.7M req", progress: 72, status: "healthy" },
  { label: "GPU utilization", value: "68%", progress: 68, status: "warning" },
  { label: "LLM workloads", value: "19 active", progress: 76, status: "healthy" },
  { label: "Storage usage", value: "61%", progress: 61, status: "healthy" }
];

export const clusterHealth: ChartPoint[] = [
  { name: "00:00", value: 96 },
  { name: "04:00", value: 95 },
  { name: "08:00", value: 97 },
  { name: "12:00", value: 93 },
  { name: "16:00", value: 94 },
  { name: "20:00", value: 96 }
];

export const deploymentLogs = [
  "buildgrid-api rolled out to production cluster",
  "campusgrid-worker rebuilt with billing queue patch",
  "farmgrid-edge telemetry sync restarted in staging",
  "llm-router scaled from 4 to 7 replicas",
  "postgres read replica lag recovered to 41ms"
];

export const financeSeries: ChartPoint[] = [
  { name: "Jan", revenue: 74200, expenses: 41200 },
  { name: "Feb", revenue: 86200, expenses: 43800 },
  { name: "Mar", revenue: 97300, expenses: 46900 },
  { name: "Apr", revenue: 111000, expenses: 51600 },
  { name: "May", revenue: 125300, expenses: 54200 },
  { name: "Jun", revenue: 139000, expenses: 58800 }
];

export const expensesBreakdown = [
  { name: "Engineering", value: 34 },
  { name: "Infrastructure", value: 24 },
  { name: "Sales", value: 18 },
  { name: "AI/API", value: 14 },
  { name: "Ops", value: 10 }
];

export const profitability = [
  { name: "BuildGrid", revenue: 84200, expenses: 30200 },
  { name: "CampusGrid", revenue: 38400, expenses: 18600 },
  { name: "FarmGrid", revenue: 16400, expenses: 10000 }
];

export const acquisition = [
  { name: "Jan", customers: 1190 },
  { name: "Feb", customers: 1358 },
  { name: "Mar", customers: 1542 },
  { name: "Apr", customers: 1810 },
  { name: "May", customers: 2130 },
  { name: "Jun", customers: 2344 }
];

export const churn = [
  { name: "Jan", value: 4.8 },
  { name: "Feb", value: 4.2 },
  { name: "Mar", value: 3.9 },
  { name: "Apr", value: 3.4 },
  { name: "May", value: 3.1 },
  { name: "Jun", value: 2.8 }
];

export const funnel = [
  { name: "Visitors", value: 48000 },
  { name: "Trials", value: 8200 },
  { name: "Activated", value: 3140 },
  { name: "Paid", value: 642 }
];

export const geography = [
  { name: "North America", value: 48 },
  { name: "Europe", value: 22 },
  { name: "Asia Pacific", value: 18 },
  { name: "Middle East", value: 7 },
  { name: "LATAM", value: 5 }
];

// ── Pricing ──────────────────────────────────────────────────────────────────

export const plans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    priceMonthly: 4999,
    priceAnnual: 47990,
    maxSeats: 25,
    maxProducts: 1,
    savingsPercent: 20,
    features: [
      "1 product access",
      "Up to 25 seats",
      "Standard support",
      "Core modules only",
      "Email onboarding",
    ],
  },
  {
    id: 2,
    name: "Pro",
    priceMonthly: 14999,
    priceAnnual: 143990,
    maxSeats: 100,
    maxProducts: 2,
    savingsPercent: 20,
    features: [
      "Up to 2 product access",
      "Up to 100 seats",
      "Priority support",
      "All modules included",
      "Dedicated account manager",
      "Client portal access",
      "AI agent assignment",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    priceMonthly: 39999,
    priceAnnual: 383990,
    maxSeats: 0,
    maxProducts: 0,
    savingsPercent: 20,
    features: [
      "Unlimited product access",
      "Unlimited seats",
      "24/7 dedicated support",
      "All modules + custom modules",
      "Dedicated account manager",
      "Client portal access",
      "AI agent assignment",
      "Custom integrations",
      "SLA guarantee",
      "White-label option",
    ],
  },
];

// ── CRM Clients ───────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: 1,
    name: "Mother Teresa Educational Trust",
    organization: "Mother Teresa Educational Trust",
    contactPerson: "Sr. Maria Fernandes",
    email: "admin@mtet.edu.in",
    phone: "+91-80-4321-0000",
    industry: "Education",
    tenantId: "mother-teresa-educational-trust",
    planId: 3,
    planName: "Enterprise",
    region: "South Asia",
    dealValue: 480000,
    portalEnabled: true,
    onboardingStatus: "active",
    accountManagerId: 1,
    notes: "Multi-school management system. 12 campuses across Karnataka. Requires custom academic calendar module.",
    tags: ["education", "multi-campus", "karnataka", "enterprise"],
    products: [
      {
        id: 1,
        productSlug: "campusgrid",
        provisioned: true,
        enabledModules: ["admissions", "academics", "billing", "reports", "communication"],
      },
    ],
    users: [
      { id: 1, email: "admin@mtet.edu.in", role: "admin", invited: true, accepted: true },
      { id: 2, email: "principal@mtet.edu.in", role: "manager", invited: true, accepted: false },
    ],
    createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: 2,
    name: "BBU Global Infra Pvt Ltd",
    organization: "BBU Global Infra Pvt Ltd",
    contactPerson: "Bhupinder Singh",
    email: "director@bbuglobal.in",
    phone: "+91-11-6789-0000",
    industry: "Construction",
    tenantId: "bbu-global-infra",
    planId: 2,
    planName: "Pro",
    region: "North India",
    dealValue: 179988,
    portalEnabled: true,
    onboardingStatus: "active",
    accountManagerId: 1,
    notes: "Interior and infrastructure execution company. 3 active project sites in Delhi NCR. Needs BOQ and vendor payment modules.",
    tags: ["construction", "interior", "delhi-ncr", "pro"],
    products: [
      {
        id: 2,
        productSlug: "buildgrid",
        provisioned: true,
        enabledModules: ["projects", "boq", "vendors", "finance", "procurement"],
      },
    ],
    users: [
      { id: 3, email: "director@bbuglobal.in", role: "admin", invited: true, accepted: true },
      { id: 4, email: "pm@bbuglobal.in", role: "manager", invited: true, accepted: true },
      { id: 5, email: "accounts@bbuglobal.in", role: "viewer", invited: true, accepted: false },
    ],
    createdAt: "2026-04-20T09:30:00Z",
  },
];
