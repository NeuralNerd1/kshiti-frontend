"use client";

import { FlowStep, ActionDefinition } from "../types";

import ParameterForm from "./ParameterForm";
import HooksPanel from "./HooksPanel";

type Props = {
  step: FlowStep | null;
  action: ActionDefinition | null;
  onUpdate?: (params: Record<string, any>) => void;
  readOnly?: boolean;
};

export default function StepInspector({
  step,
  action,
  onUpdate,
  readOnly = false,
}: Props) {
  if (!step) {
    return (
      <div className="builder-inspector-empty">
        Select a step to configure
      </div>
    );
  }

  const schema = action?.parameter_schema ?? null;

  return (
    <div className="builder-inspector">
      {/* PARAMETERS */}
      <ParameterForm
        parameters={step.parameters}
        schema={schema}
        readOnly={readOnly}
        onChange={(params) => {
          if (readOnly) return;
          onUpdate?.(params);
        }}
      />

      {/* EXECUTION NOTES */}
      <HooksPanel
        value={step.execution_notes?.before?.[0] || ""}
        readOnly={readOnly}
        onChange={(text) => {
          if (readOnly) return;

          onUpdate?.({
            __execution_notes: {
              before: text ? [text] : [],
            },
          });
        }}
      />
    </div>
  );
}
