"use client";

import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { factoryStages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useFactoryStore } from "@/store/factory-store";
import type { ProductIdea } from "@/types";

const priorityTone: Record<ProductIdea["priority"], "red" | "amber" | "green"> = {
  High: "red",
  Medium: "amber",
  Low: "green"
};

export default function ProductFactoryPage() {
  const ideas = useFactoryStore((state) => state.ideas);
  const moveIdea = useFactoryStore((state) => state.moveIdea);

  function handleDragEnd(event: DragEndEvent) {
    const ideaId = String(event.active.id);
    const nextStage = event.over?.id;

    if (nextStage && factoryStages.includes(nextStage as ProductIdea["stage"])) {
      moveIdea(ideaId, nextStage as ProductIdea["stage"]);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Factory"
        title="Startup launch pipeline"
        description="Move product ideas from raw opportunity through research, validation, MVP, development, testing, launch, and scale."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            New Idea
          </Button>
        }
      />

      <DndContext onDragEnd={handleDragEnd}>
        <section className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-4 2xl:grid-cols-8">
          {factoryStages.map((stage) => (
            <FactoryColumn
              key={stage}
              stage={stage}
              ideas={ideas.filter((idea) => idea.stage === stage)}
            />
          ))}
        </section>
      </DndContext>
    </div>
  );
}

function FactoryColumn({ stage, ideas }: { stage: ProductIdea["stage"]; ideas: ProductIdea[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[34rem] min-w-[17rem] rounded-lg border border-white/10 bg-slate-950/35 p-3 transition",
        isOver && "border-cyan-300/50 bg-cyan-300/5"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">{stage}</h2>
        <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-slate-500">
          {ideas.length}
        </span>
      </div>

      <div className="space-y-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}

function IdeaCard({ idea }: { idea: ProductIdea }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.id
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("cursor-grab touch-none transition active:cursor-grabbing", isDragging && "opacity-70")}
      {...listeners}
      {...attributes}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-50">{idea.title}</p>
            <p className="mt-1 text-xs text-slate-500">{idea.category}</p>
          </div>
          <GripVertical className="h-4 w-4 text-slate-600" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <FactoryMetric label="Market" value={idea.marketSize} />
          <FactoryMetric label="Revenue" value={idea.estimatedRevenue} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={priorityTone[idea.priority]}>{idea.priority}</Badge>
          <Badge>{idea.assignedTeam}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function FactoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/40 p-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-200">{value}</p>
    </div>
  );
}
