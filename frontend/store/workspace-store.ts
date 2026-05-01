import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActiveProduct = "buildgrid" | "campusgrid" | "farmgrid" | "medigrid" | null;
export type WorkspaceMode = "hq" | "tenant";

type WorkspaceState = {
  workspace: string;
  setWorkspace: (workspace: string) => void;
  activeProduct: ActiveProduct;
  setActiveProduct: (product: ActiveProduct) => void;
  mode: WorkspaceMode;
  tenantId: string | null;
  tenantName: string | null;
  enterWorkspace: (tenantId: string, tenantName: string, product: ActiveProduct) => void;
  exitWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspace: "GridSphere HQ",
      setWorkspace: (workspace) => set({ workspace }),
      activeProduct: null,
      setActiveProduct: (activeProduct) => set({ activeProduct }),
      mode: "hq",
      tenantId: null,
      tenantName: null,
      enterWorkspace: (tenantId, tenantName, product) =>
        set({ mode: "tenant", tenantId, tenantName, activeProduct: product }),
      exitWorkspace: () =>
        set({ mode: "hq", tenantId: null, tenantName: null }),
    }),
    { name: "gridsphere-workspace" }
  )
);
