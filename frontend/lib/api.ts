import type {
  AgentRunSummary,
  CommandCentreOverview,
  TenantOverview,
} from "@/types";

import {
  acquisition,
  activities,
  agentLogs,
  agents,
  bgBOQItems,
  bgProjects,
  bgPurchaseOrders,
  bgVendors,
  churn,
  clients,
  clusterHealth,
  deploymentLogs,
  executiveKpis,
  expensesBreakdown,
  financeSeries,
  funnel,
  geography,
  infrastructureMetrics,
  monthlyExpenses,
  plans,
  productGrowth,
  products,
  profitability,
  quickActions,
  revenueGrowth
} from "@/lib/mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function mock<T>(data: T, delay = 180): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay);
  });
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  if (!API_URL) {
    return mock(fallback);
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return mock(fallback);
  }
}

export const dashboardApi = {
  executive: async () => {
    const data = await getJson("/dashboard/executive", {
      kpis: executiveKpis,
      revenueGrowth,
      productGrowth,
      monthlyExpenses,
      activities,
      quickActions
    });

    return {
      ...data,
      kpis: data.kpis.map((kpi, index) => {
        const localKpi =
          executiveKpis.find((item) => item.label === kpi.label) ??
          executiveKpis[index] ??
          executiveKpis[0];
        return {
          ...localKpi,
          ...kpi,
          icon: localKpi.icon
        };
      })
    };
  },
  products: () => getJson("/products", products),
  product: (slug: string) =>
    getJson(`/products/${slug}`, products.find((product) => product.slug === slug) ?? products[0]),
  agents: () => getJson("/agents", { agents, logs: agentLogs }),
  infrastructure: () =>
    getJson("/infrastructure", {
      metrics: infrastructureMetrics,
      clusterHealth,
      deploymentLogs
    }),
  finance: () =>
    getJson("/finance", {
      financeSeries,
      expensesBreakdown,
      profitability
    }),
  analytics: () =>
    getJson("/analytics", {
      acquisition,
      churn,
      funnel,
      geography,
      adoption: products.map((product) => ({
        name: product.name,
        value: product.health
      }))
    })
};

export const pricingApi = {
  plans: () => getJson("/pricing/plans", plans),
};

export const buildgridApi = {
  projects: (tenantId?: string) =>
    getJson(
      `/buildgrid/projects${tenantId ? `?tenant_id=${tenantId}` : ""}`,
      tenantId ? bgProjects.filter((p) => p.tenantId === tenantId) : bgProjects
    ),
  project: (id: string) =>
    getJson(
      `/buildgrid/projects/${id}`,
      bgProjects.find((p) => p.id === id) ?? bgProjects[0]
    ),
  createProject: async (payload: unknown) => {
    if (!API_URL) return mock(bgProjects[0]);
    const res = await fetch(`${API_URL}/buildgrid/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  boqItems: (projectId?: string) =>
    getJson(
      `/buildgrid/boq${projectId ? `?project_id=${projectId}` : ""}`,
      projectId ? bgBOQItems.filter((b) => b.projectId === projectId) : bgBOQItems
    ),
  createBOQItem: async (payload: unknown) => {
    if (!API_URL) return mock(bgBOQItems[0]);
    const res = await fetch(`${API_URL}/buildgrid/boq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  vendors: (tenantId?: string) =>
    getJson(
      `/buildgrid/vendors${tenantId ? `?tenant_id=${tenantId}` : ""}`,
      tenantId ? bgVendors.filter((v) => v.tenantId === tenantId) : bgVendors
    ),
  purchaseOrders: (projectId?: string) =>
    getJson(
      `/buildgrid/purchase-orders${projectId ? `?project_id=${projectId}` : ""}`,
      projectId
        ? bgPurchaseOrders.filter((po) => po.projectId === projectId)
        : bgPurchaseOrders
    ),
  createPurchaseOrder: async (payload: unknown) => {
    if (!API_URL) return mock(bgPurchaseOrders[0]);
    const res = await fetch(`${API_URL}/buildgrid/purchase-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
};

export const crmApi = {
  clients: () => getJson("/crm/clients", clients),
  client: (id: number) =>
    getJson(`/crm/clients/${id}`, clients.find((c) => c.id === id) ?? clients[0]),
  createClient: async (payload: unknown) => {
    if (!API_URL) {
      return mock(clients[0]);
    }
    const response = await fetch(`${API_URL}/crm/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },
  updateStatus: async (id: number, status: string) => {
    if (!API_URL) {
      return mock({ ...clients[0], onboardingStatus: status });
    }
    const response = await fetch(`${API_URL}/crm/clients/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarding_status: status }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },
};

// ── GridSphere Core (Command Centre) ─────────────────────────────────────────

const _mockOverview: CommandCentreOverview = {
  totalTenants: 2,
  activeTenants: 2,
  totalArr: 659988,
  productDistribution: { buildgrid: 1, campusgrid: 1 },
  agentRuns24h: 0,
  agentFailures24h: 0,
  recentAgentRuns: [],
  recentEvents: [],
};

const _mockTenants: TenantOverview[] = clients.map((c) => ({
  id: c.id,
  tenantId: c.tenantId,
  name: c.name,
  organization: c.organization,
  industry: c.industry,
  region: c.region,
  onboardingStatus: c.onboardingStatus,
  planName: c.planName,
  dealValue: c.dealValue,
  portalEnabled: c.portalEnabled,
  activeProducts: c.products.filter((p) => p.provisioned).map((p) => p.productSlug),
  totalProducts: c.products.length,
  createdAt: c.createdAt,
}));

export const gridsphereApi = {
  overview: (): Promise<CommandCentreOverview> =>
    getJson("/gridsphere/overview", _mockOverview),

  tenants: (): Promise<TenantOverview[]> =>
    getJson("/gridsphere/tenants", _mockTenants),

  deployTenant: async (payload: {
    tenant_id: string;
    client_name: string;
    products: string[];
    plan?: string;
    region?: string;
  }) => {
    if (!API_URL) return mock({ status: "deployed", mode: "mock", tenant_id: payload.tenant_id });
    const res = await fetch(`${API_URL}/gridsphere/deploy/tenant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  deployProduct: async (payload: { tenant_id: string; product_slug: string; enabled_modules?: string[] }) => {
    if (!API_URL) return mock({ status: "activated", tenant_id: payload.tenant_id, product: payload.product_slug });
    const res = await fetch(`${API_URL}/gridsphere/deploy/product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
};

// ── AI Agent dispatch + run history ───────────────────────────────────────────

const _mockRuns: AgentRunSummary[] = [];

export const aiAgentsApi = {
  runs: (params?: { agentType?: string; tenantId?: string; limit?: number }): Promise<AgentRunSummary[]> => {
    const qs = new URLSearchParams();
    if (params?.agentType) qs.set("agent_type", params.agentType);
    if (params?.tenantId) qs.set("tenant_id", params.tenantId);
    if (params?.limit) qs.set("limit", String(params.limit));
    return getJson(`/ai-agents/runs${qs.size ? `?${qs}` : ""}`, _mockRuns);
  },

  run: (id: number) => getJson(`/ai-agents/runs/${id}`, _mockRuns[0] ?? null),

  dispatchSales: async (payload: {
    name: string;
    email: string;
    company: string;
    industry: string;
    company_size?: string;
    product_interest?: string[];
  }) => {
    if (!API_URL) return mock({ queued: false, agent: "SalesAgent" });
    const res = await fetch(`${API_URL}/ai-agents/dispatch/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  dispatchDeployment: async (payload: {
    tenant_id: string;
    client_name: string;
    products: string[];
    plan?: string;
  }) => {
    if (!API_URL) return mock({ queued: false, agent: "DeploymentAgent" });
    const res = await fetch(`${API_URL}/ai-agents/dispatch/deployment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
};
