"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import FlowBuilderShell from "@/components/planning/builder/FlowBuilderShell/FlowBuilderShell";
import LeftActionBar from "@/components/planning/builder/LeftActionBar/LeftActionBar";
import BuilderCanvas from "@/components/planning/builder/Canvas/BuilderCanvas";
import StepInspector from "@/components/planning/builder/Inspector/StepInspector";

import { useFlowBuilder } from "@/hooks/planning/useFlowBuilder";

import { toast } from "@/components/common/toast/toast";

import {
  FlowStep,
  RegistryAction,
} from "@/components/planning/builder/types";

export default function EditImportFlowPage() {
  const params = useParams();
  const router = useRouter();

  const company = params.company as string;
  const projectId = params.project as string;

  const testCaseId = Number(params.testCaseId);
  const flowId = Number(params.flowId);

  const {
    flow,
    steps,
    registry,
    loading,
    addStep,
    removeStep,
    updateStep,
  } = useFlowBuilder(flowId);

  const [selectedStepId, setSelectedStepId] =
    useState<string | null>(null);

  const selectedStep: FlowStep | null =
    useMemo(() => {
      if (!selectedStepId) return null;
      return (
        steps.find(
          (s) => s.step_id === selectedStepId
        ) ?? null
      );
    }, [steps, selectedStepId]);

  const selectedAction: RegistryAction | null =
    useMemo(() => {
      if (!selectedStep) return null;

      for (const category of registry || []) {
        const action =
          category.actions.find(
  (a: RegistryAction) =>
    a.action_key === selectedStep.action_key
);
        if (action) return action;
      }

      return null;
    }, [selectedStep, registry]);

  if (loading) return null;

  if (!flow) {
    return (
      <div className="p-6 text-sm text-red-400">
        Flow not found
      </div>
    );
  }

  return (
    <FlowBuilderShell
      header={
  <div className="builder-header">
    <div className="builder-header-row">
      {/* LEFT */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => router.back()}
          className="text-sm text-indigo-400 hover:text-indigo-300 w-fit"
        >
          ← Back
        </button>

        <div className="builder-title">
          {flow.name}
        </div>

        <div className="text-xs text-gray-400">
          Temporary edit · Changes won’t affect the original flow
        </div>
      </div>

      {/* RIGHT */}
      <div className="builder-actions">
        <button
          className="import-flow-btn"
          onClick={() =>
            toast.info(
              "Import logic will be added later"
            )
          }
        >
          Import into test case
        </button>
      </div>
    </div>
  </div>
}

      

      left={
        <LeftActionBar
          categories={registry}
          onAddStep={addStep}
        />
      }

      center={
        <BuilderCanvas
          sections={[
            {
              id: "steps",
              title: "Steps",
              steps,
            },
          ]}
          selectedStepId={selectedStepId}
          onSelectStep={setSelectedStepId}
          onDeleteStep={removeStep}
        />
      }

      right={
        <StepInspector
          step={selectedStep}
          action={selectedAction}
          onUpdate={(patch) => {
            if (!selectedStep) return;

            updateStep(
              selectedStep.step_id,
              patch
            );
          }}
        />
      }
    />
  );
}
