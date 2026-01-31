"use client";

import { FlowStep } from "../types";
import StepCard from "./StepCard";

type Props = {
  section: {
    id: string;
    title: string;
    steps: FlowStep[];
  };
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
};

export default function BuilderSection({
  section,
  selectedStepId,
  onSelectStep,
  onDeleteStep,
}: Props) {
  return (
    <section id={section.id}>
      <h2 className="builder-section-title">
        {section.title}
      </h2>

      <div className="builder-steps">
        {section.steps.map((step, index) => (
          <StepCard
            key={step.step_id}
            step={step}
            index={index}
            selected={
              step.step_id === selectedStepId
            }
            onSelect={() =>
              onSelectStep(step.step_id)
            }
            onDelete={onDeleteStep}
          />
        ))}
      </div>
    </section>
  );
}
