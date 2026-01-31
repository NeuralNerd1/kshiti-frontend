"use client";

import { FlowStep } from "../types";
import BuilderSection from "./BuilderSection";

type Section = {
  id: string;
  title: string;
  steps: FlowStep[];
};

type Props = {
  sections: Section[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void; 
};

export default function BuilderCanvas({
  sections,
  selectedStepId,
  onSelectStep,
  onDeleteStep,
}: Props) {
  return (
    <div className="builder-canvas">
      {sections.map((section) => (
        <BuilderSection
          key={section.id}
          section={section}
          selectedStepId={selectedStepId}
          onSelectStep={onSelectStep}
          onDeleteStep={onDeleteStep}
        />
      ))}
    </div>
  );
}
