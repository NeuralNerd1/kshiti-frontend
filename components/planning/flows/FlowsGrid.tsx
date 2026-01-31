"use client";

import FlowCard from "./FlowCard";

type UIFlow = {
  id: number;
  name: string;
  description?: string;
  folder?: number | null;
  status:
    | "ACTIVE"
    | "ARCHIVED"
    | "draft"
    | "active"
    | "archived";
};


type FlowsGridProps = {
  flows: UIFlow[];
  loading: boolean;
  onOpenFlow: (id: number) => void;
  onEditFlow: (flow: UIFlow) => void;
  onDeleteFlow: (id: number) => void;
  onArchiveFlow: (id: number) => void;
};

export default function FlowsGrid({
  flows,
  loading,
  onOpenFlow,
  onEditFlow,
  onDeleteFlow,
  onArchiveFlow,
}: FlowsGridProps) {
  if (loading) {
    return <div className="flows-empty">Loading flows…</div>;
  }

  if (flows.length === 0) {
    return (
      <div className="flows-empty">
        No flows in this folder
      </div>
    );
  }

  return (
    <div className="flows-grid">
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          id={flow.id}
          name={flow.name}
          description={flow.description}
          status={
  flow.status === "ACTIVE"
    ? "active"
    : flow.status === "ARCHIVED"
    ? "archived"
    : flow.status
}
          onOpen={() => onOpenFlow(flow.id)}
          onEdit={() => onEditFlow(flow)}
          onDeleted={onDeleteFlow}
          onArchived={onArchiveFlow}
        />
      ))}
    </div>
  );
}
