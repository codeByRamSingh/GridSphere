export type ProductErpModule = {
  href: string;
  label: string;
  live: boolean;
};

export type ProductConfig = {
  slug: string;
  label: string;
  description: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
  workspaceUrl: (tenantId: string) => string;
  hqUrl: string;
  erpModules: ProductErpModule[];
};

const REGISTRY: Record<string, ProductConfig> = {
  buildgrid: {
    slug: "buildgrid",
    label: "BuildGrid",
    description: "Construction ERP",
    accentColor: "cyan",
    textColor: "text-cyan-300",
    bgColor: "bg-cyan-300/10",
    workspaceUrl: (tenantId) =>
      `/products/buildgrid/workspace/dashboard?tenant_id=${tenantId}`,
    hqUrl: "/products/buildgrid/dashboard",
    erpModules: [
      { href: "dashboard",   label: "Dashboard",   live: true  },
      { href: "projects",    label: "Projects",    live: true  },
      { href: "boq",         label: "BOQ",         live: true  },
      { href: "procurement", label: "Procurement", live: true  },
      { href: "inventory",   label: "Inventory",   live: false },
      { href: "execution",   label: "Execution",   live: false },
      { href: "finance",     label: "Finance",     live: false },
      { href: "reports",     label: "Reports",     live: false },
    ],
  },
  campusgrid: {
    slug: "campusgrid",
    label: "CampusGrid",
    description: "Education ERP",
    accentColor: "violet",
    textColor: "text-violet-300",
    bgColor: "bg-violet-300/10",
    workspaceUrl: (tenantId) =>
      `/products/campusgrid/workspace/dashboard?tenant_id=${tenantId}`,
    hqUrl: "/products/campusgrid/dashboard",
    erpModules: [
      { href: "dashboard",  label: "Dashboard",  live: false },
      { href: "admissions", label: "Admissions", live: false },
      { href: "academics",  label: "Academics",  live: false },
      { href: "billing",    label: "Billing",    live: false },
      { href: "staff",      label: "Staff",      live: false },
      { href: "reports",    label: "Reports",    live: false },
    ],
  },
  farmgrid: {
    slug: "farmgrid",
    label: "FarmGrid",
    description: "Farm Operations ERP",
    accentColor: "emerald",
    textColor: "text-emerald-300",
    bgColor: "bg-emerald-300/10",
    workspaceUrl: (tenantId) =>
      `/products/farmgrid/workspace/dashboard?tenant_id=${tenantId}`,
    hqUrl: "/products/farmgrid/dashboard",
    erpModules: [
      { href: "dashboard", label: "Dashboard", live: false },
      { href: "crops",     label: "Crops",     live: false },
      { href: "inventory", label: "Inventory", live: false },
      { href: "sensors",   label: "Sensors",   live: false },
      { href: "finance",   label: "Finance",   live: false },
    ],
  },
  medigrid: {
    slug: "medigrid",
    label: "MediGrid",
    description: "Medical Inventory ERP & POS",
    accentColor: "rose",
    textColor: "text-rose-300",
    bgColor: "bg-rose-300/10",
    workspaceUrl: (tenantId) =>
      `/products/medigrid/workspace/dashboard?tenant_id=${tenantId}`,
    hqUrl: "/products/medigrid/dashboard",
    erpModules: [
      { href: "dashboard", label: "Dashboard", live: false },
      { href: "inventory", label: "Inventory", live: false },
      { href: "pos",       label: "POS",       live: false },
      { href: "patients",  label: "Patients",  live: false },
      { href: "reports",   label: "Reports",   live: false },
    ],
  },
};

export function getProductConfig(slug: string): ProductConfig | undefined {
  return REGISTRY[slug];
}

export function getWorkspaceUrl(productSlug: string, tenantId: string): string {
  return REGISTRY[productSlug]?.workspaceUrl(tenantId) ?? "#";
}

export { REGISTRY as PRODUCT_REGISTRY };
