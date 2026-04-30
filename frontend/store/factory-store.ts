import { create } from "zustand";
import type { ProductIdea } from "@/types";
import { productIdeas } from "@/lib/mock-data";

type FactoryState = {
  ideas: ProductIdea[];
  moveIdea: (ideaId: string, nextStage: ProductIdea["stage"]) => void;
};

export const useFactoryStore = create<FactoryState>((set) => ({
  ideas: productIdeas,
  moveIdea: (ideaId, nextStage) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, stage: nextStage } : idea
      )
    }))
}));
