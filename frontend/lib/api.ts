import {
  acquisition,
  activities,
  agentLogs,
  agents,
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
