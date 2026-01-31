"use client";

import FlowRow from "./FlowRow";
import { Flow } from "@/types/planning";

type Props = {
  flows: Flow[];
  loading: boolean;
};

export default function FlowList({ flows, loading }: Props) {
  if (loading) {
    return <div className="flows-empty">Loading flows…</div>;
  }

  if (!flows.length) {
    return (
      <div className="flows-empty">
        No flows in this folder.
      </div>
    );
  }

  return (
    <div className="flows-list">
      {flows.map((flow) => (
        <FlowRow key={flow.id} flow={flow} />
      ))}
    </div>
  );
}
