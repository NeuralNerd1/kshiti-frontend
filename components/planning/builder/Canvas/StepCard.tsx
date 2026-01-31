"use client";

import { FlowStep } from "../types";

type Props = {
  step: FlowStep;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onDelete: (stepId: string) => void; // ✅ ADD
};


export default function StepCard({
  step,
  index,
  selected,
  onSelect,
  onDelete,
}: Props) {
  const count = Object.values(step.parameters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <div
      className={`builder-step-card ${
        selected ? "active" : ""
      }`}
      onClick={onSelect}
    >
      {/* ❌ DELETE */}
      <button
        className="builder-step-delete"
        onClick={(e) => {
          e.stopPropagation(); // 🔥 IMPORTANT
          onDelete(step.step_id);
        }}
        title="Delete step"
      >
        ×
      </button>

      <div className="builder-step-title">
        {index + 1}. {step.action_key}
      </div>

      <div className="builder-step-meta">
        {count} parameters
      </div>
    </div>
  );
}
