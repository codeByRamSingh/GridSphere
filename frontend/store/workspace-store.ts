import { create } from "zustand";

type WorkspaceState = {
  workspace: string;
  setWorkspace: (workspace: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: "GridSphere HQ",
  setWorkspace: (workspace) => set({ workspace })
}));
