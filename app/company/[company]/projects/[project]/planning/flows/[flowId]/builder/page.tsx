"use client";

import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";

import "./builder.css";

import { useFlowBuilder } from "@/hooks/planning/useFlowBuilder";
import { useProject } from "@/hooks/projects/useProject";

import { toast } from "@/components/common/toast/toast";
import ConfirmationModal from "@/components/common/confirmation-modal/ConfirmationModal";

import FlowBuilderShell from "@/components/planning/builder/FlowBuilderShell/FlowBuilderShell";
import FlowBuilderHeader from "@/components/planning/builder/Header/FlowBuilderHeader";
import LeftActionBar from "@/components/planning/builder/LeftActionBar/LeftActionBar";
import BuilderCanvas from "@/components/planning/builder/Canvas/BuilderCanvas";
import StepInspector from "@/components/planning/builder/Inspector/StepInspector";
import QuickAddModal from "@/components/planning/builder/QuickAddModal/QuickAddModal";

import {
  FlowStep,
  RegistryAction,
} from "@/components/planning/builder/types";

/* ======================================================
   PAGE
====================================================== */

export default function FlowBuilderPage() {
  const params = useParams();

  const company = params.company;
  const projectId = params.project;
  const flowId = Number(params.flowId);

  const [quickAddOpen, setQuickAddOpen] =
    useState(false);

  const [confirmReloadOpen, setConfirmReloadOpen] =
    useState(false);

  const {
    flow,
    registry,

    steps,
    selectedStepId,

    loading,
    saving,
    dirty,

    currentVersion,
    activeVersion,

    addStep,
    updateStep,
    removeStep,
    saveVersion,
    setSelectedStepId,
  } = useFlowBuilder(flowId);

  /* ======================================================
     UNSAVED REFRESH PROTECTION
  ====================================================== */

  useEffect(() => {
    const handleBeforeUnload = (
      e: BeforeUnloadEvent
    ) => {
      if (!dirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
  }, [dirty]);

  /* ======================================================
     SELECTED STEP
  ====================================================== */

  const selectedStep: FlowStep | null =
    useMemo(() => {
      if (!selectedStepId) return null;
      return (
        steps.find(
          (s) => s.step_id === selectedStepId
        ) ?? null
      );
    }, [steps, selectedStepId]);

  /* ======================================================
     ACTION SCHEMA
  ====================================================== */

  const selectedAction: RegistryAction | null =
    useMemo(() => {
      if (!selectedStep) return null;

      for (const category of registry) {
        const action =
  category.actions.find(
    (a: RegistryAction) =>
      a.action_key ===
      selectedStep.action_key
  );
        if (action) return action;
      }

      return null;
    }, [selectedStep, registry]);

  /* ======================================================
     SECTIONS
  ====================================================== */

  const sections = useMemo(
    () => [
      {
        id: "steps",
        title: "Steps",
        steps,
      },
    ],
    [steps]
  );

  /* ======================================================
     BREADCRUMBS
  ====================================================== */

  const breadcrumbs = useMemo(
    () => [
      {
        label: "Planning",
        href: `/company/${company}/projects/${projectId}/planning`,
      },
      {
        label: "Flows",
        href: `/company/${company}/projects/${projectId}/planning/flows`,
      },
      {
        label: flow?.name || "Flow Builder",
      },
    ],
    [company, projectId, flow?.name]
  );

  /* ======================================================
     SAVE
  ====================================================== */

  const handleSave = async () => {
    const success = await saveVersion();

    success
      ? toast.success("Flow saved successfully")
      : toast.error("Failed to save flow");
  };

  /* ======================================================
     QUICK ADD (SHIFT + A)
  ====================================================== */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        e.key.toLowerCase() === "a"
      ) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, []);

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-400">
        Loading flow builder…
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="p-6 text-sm text-red-400">
        Flow not found
      </div>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      <FlowBuilderShell
        header={
          <FlowBuilderHeader
            breadcrumbs={breadcrumbs}
            flowName={flow.name}
            versions={flow.versions || []}
            currentVersion={currentVersion}
            activeVersion={activeVersion}
            dirty={dirty}
            saving={saving}
            onSave={handleSave}
          />
        }
        left={
          <LeftActionBar
            categories={registry}
            onAddStep={addStep}
          />
        }
        center={
          <BuilderCanvas
            sections={sections}
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

              if ("__execution_notes" in patch) {
                updateStep(
                  selectedStep.step_id,
                  {
                    execution_notes: {
                      ...selectedStep.execution_notes,
                      ...patch.__execution_notes,
                    },
                  }
                );
                return;
              }

              if ("__meta" in patch) {
                updateStep(
                  selectedStep.step_id,
                  {
                    meta: patch.__meta,
                  }
                );
                return;
              }

              updateStep(
                selectedStep.step_id,
                {
                  parameters: {
                    ...selectedStep.parameters,
                    ...patch,
                  },
                }
              );
            }}
          />
        }
      />

      {/* QUICK ADD */}
      <QuickAddModal
        open={quickAddOpen}
        registry={registry}
        onClose={() =>
          setQuickAddOpen(false)
        }
        onAdd={(actionKey) => {
          addStep(actionKey);
          setQuickAddOpen(false);
        }}
      />

      {/* CONFIRM RELOAD */}
      <ConfirmationModal
        open={confirmReloadOpen}
        title="Unsaved changes"
        message="You have unsaved changes in this flow. Reloading will discard them."
        confirmText="Reload anyway"
        cancelText="Wait"
        onCancel={() =>
          setConfirmReloadOpen(false)
        }
        onConfirm={() => {
          setConfirmReloadOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
