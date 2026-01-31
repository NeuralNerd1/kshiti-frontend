"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

import FlowBuilderShell from "@/components/planning/builder/FlowBuilderShell/FlowBuilderShell";
import BuilderCanvas from "@/components/planning/builder/Canvas/BuilderCanvas";
import StepInspector from "@/components/planning/builder/Inspector/StepInspector";

import { useFlowBuilder } from "@/hooks/planning/useFlowBuilder";

import ViewFlowHeader from "@/components/planning/test-cases/view/ViewFlowHeader";

import { importFlowToTestCase } from "@/services/planning/flowImportService";
import { toast } from "@/components/common/toast/toast";

import {
  FlowStep,
  RegistryAction,
} from "@/components/planning/builder/types";

export default function TestCaseFlowViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const company = params.company as string;
  const projectId = params.project as string;

  const testCaseId = Number(params.testCaseId);
  const flowId = Number(params.flowId);

  const targetSection =
    searchParams.get("section") as
      | "pre_conditions"
      | "steps"
      | "expected_outcomes";

  const {
    flow,
    steps,
    registry,
    loading,
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
        <ViewFlowHeader
          flowName={flow.name}
          onBack={() => router.back()}
          onImport={async () => {
            try {
              await importFlowToTestCase(
                testCaseId,
                flowId,
                targetSection
              );

              toast.success("Flow imported successfully");

              router.push(
                `/company/${company}/projects/${projectId}/planning/test-cases/${testCaseId}/builder`
              );
            } catch {
              toast.error("Failed to import flow");
            }
          }}
          onEditImport={() => {
            router.push(
              `/company/${company}/projects/${projectId}/planning/test-cases/${testCaseId}/edit-import/${flowId}`
            );
          }}
        />
      }

      left={null}

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
          onDeleteStep={() => {}}
        />
      }

      right={
        <StepInspector
          step={selectedStep}
          action={selectedAction}
          readOnly
        />
      }
    />
  );
}
