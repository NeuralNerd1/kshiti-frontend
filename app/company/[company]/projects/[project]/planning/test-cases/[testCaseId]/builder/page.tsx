"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

import "./builder.css";

import FlowBuilderShell from "@/components/planning/builder/FlowBuilderShell/FlowBuilderShell";
import LeftActionBar from "@/components/planning/builder/LeftActionBar/LeftActionBar";
import BuilderCanvas from "@/components/planning/builder/Canvas/BuilderCanvas";
import StepInspector from "@/components/planning/builder/Inspector/StepInspector";
import QuickAddModal from "@/components/planning/builder/QuickAddModal/QuickAddModal";

import TestCaseBuilderHeader from "@/components/planning/test-cases/builder/TestCaseBuilderHeader";
import SectionSwitcher from "@/components/planning/test-cases/builder/SectionSwitcher";

import ConfirmationModal from "@/components/common/confirmation-modal/ConfirmationModal";
import ImportFlowModal from "@/components/planning/test-cases/import-flow/ImportFlowModal";

import { useProject } from "@/hooks/projects/useProject";
import { useTestCaseBuilder } from "@/hooks/planning/useTestCaseBuilder";

import { toast } from "@/components/common/toast/toast";
import {
  importFlowToTestCase,
} from "@/services/planning/flowImportService";


import {
  FlowStep,
  RegistryAction,
} from "@/components/planning/builder/types";

export default function TestCaseBuilderPage() {
  const params = useParams();
  const router = useRouter();

  const company = params.company as string;
  const projectId = params.project as string;
  const testCaseId = Number(params.testCaseId);

  const { project, loading: projectLoading } =
    useProject();

  const builder = useTestCaseBuilder(testCaseId);

  const [quickAddOpen, setQuickAddOpen] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [pendingHref, setPendingHref] =
    useState<string | null>(null);

  const [importOpen, setImportOpen] =
    useState(false);

  const [importSection, setImportSection] =
    useState<
      "pre_conditions" | "steps" | "expected_outcomes" | null
    >(null);

  const activeSection = builder.activeSection;

  const hasUnsavedChanges =
    builder.dirtySections?.[activeSection];

  const canImportFlow =
    project?.flows_enabled === true &&
    project?.test_cases_enabled === true;

  /* ======================================================
     BROWSER REFRESH PROTECTION
  ====================================================== */

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () =>
      window.removeEventListener(
        "beforeunload",
        handler
      );
  }, [hasUnsavedChanges]);

  /* ======================================================
     INTERCEPT LINK NAVIGATION
  ====================================================== */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;
      if (!hasUnsavedChanges) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      e.preventDefault();

      setPendingHref(href);
      setConfirmOpen(true);
    };

    document.addEventListener("click", handler);

    return () =>
      document.removeEventListener(
        "click",
        handler
      );
  }, [hasUnsavedChanges]);

  /* ======================================================
     SAFE FALLBACKS
  ====================================================== */

  const steps = builder.steps ?? [];
  const registry = builder.registry ?? [];

  /* ======================================================
     SELECTED STEP
  ====================================================== */

  const selectedStep: FlowStep | null =
    useMemo(() => {
      if (!builder.selectedStepId)
        return null;

      return (
        steps.find(
          (s) =>
            s.step_id ===
            builder.selectedStepId
        ) ?? null
      );
    }, [steps, builder.selectedStepId]);

  /* ======================================================
     ACTION
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
        id: activeSection,
        title:
          activeSection === "pre_conditions"
            ? "Pre Conditions"
            : activeSection ===
              "expected_outcomes"
            ? "Expected Outcomes"
            : "Steps",
        steps,
      },
    ],
    [activeSection, steps]
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
        label: "Test Cases",
        href: `/company/${company}/projects/${projectId}/planning/test-cases`,
      },
      {
        label:
          builder.testCase?.name ||
          "Test Case",
      },
    ],
    [
      company,
      projectId,
      builder.testCase?.name,
    ]
  );

  /* ======================================================
     QUICK ADD
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

    window.addEventListener("keydown", handler);
    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, []);

  /* ======================================================
     HARD STOPS
  ====================================================== */

  if (projectLoading || builder.loading)
    return null;

  if (!project) notFound();
  if (!project.test_cases_enabled)
    notFound();
  if (
    !project.permissions?.can_edit_test_cases
  )
    notFound();

  if (!builder.testCase) {
    return (
      <div className="p-6 text-sm text-red-400">
        Test case not found
      </div>
    );
  }

  /* ======================================================
     SAVE
  ====================================================== */

  const handleSave = async () => {
    const ok =
      await builder.saveActiveSection();

    ok
      ? toast.success("Section saved")
      : toast.error("Failed to save section");
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      <FlowBuilderShell
        title={builder.testCase.name}
        header={
          <TestCaseBuilderHeader
            testCaseName={builder.testCase.name}
            breadcrumbs={breadcrumbs}
            versions={builder.versions}
            currentVersion={
              builder.currentVersion
            }
            dirty={
              builder.dirtySections[
                activeSection
              ]
            }
            onSave={handleSave}
          />
        }
        left={
          <LeftActionBar
            categories={registry}
            onAddStep={builder.addStep}
          />
        }
        center={
          <>
            <div className="builder-canvas-wrapper">
              <BuilderCanvas
                sections={sections}
                selectedStepId={
                  builder.selectedStepId
                }
                onSelectStep={
                  builder.setSelectedStepId
                }
                onDeleteStep={
                  builder.removeStep
                }
              />
            </div>

            {canImportFlow && (
              <div className="builder-import-bar">
                <button
                  className="import-flow-btn"
                  onClick={() => {
                    setImportSection(
                      activeSection
                    );
                    setImportOpen(true);
                  }}
                >
                  Import Flow
                </button>
              </div>
            )}

            <SectionSwitcher
              active={activeSection}
              dirty={builder.dirtySections}
              onChange={
                builder.setActiveSection
              }
            />
          </>
        }
        right={
          <StepInspector
            step={selectedStep}
            action={selectedAction}
            onUpdate={(patch) => {
              if (!selectedStep) return;

              if (
                "__execution_notes" in
                patch
              ) {
                builder.updateStep(
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
                builder.updateStep(
                  selectedStep.step_id,
                  {
                    meta: patch.__meta,
                  }
                );
                return;
              }

              builder.updateStep(
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

      <QuickAddModal
        open={quickAddOpen}
        registry={registry}
        onClose={() =>
          setQuickAddOpen(false)
        }
        onAdd={(actionKey) => {
          builder.addStep(actionKey);
          setQuickAddOpen(false);
        }}
      />

      <ConfirmationModal
        open={confirmOpen}
        title="Unsaved changes"
        message="You have unsaved changes. Do you want to leave without saving?"
        confirmText="Leave"
        cancelText="Stay"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingHref(null);
        }}
        onConfirm={() => {
          setConfirmOpen(false);
          if (pendingHref) {
            router.push(pendingHref);
          }
        }}
      />

      {importOpen && importSection && (
        <ImportFlowModal
  open={importOpen}
  projectId={Number(projectId)}
  testCaseId={testCaseId}
  section={importSection}
  onClose={() => {
    setImportOpen(false);
    setImportSection(null);
  }}

  onImport={async (flowId) => {
  if (!importSection) return;

  try {
    await importFlowToTestCase(
      testCaseId,
      flowId,
      importSection
    );

    toast.success("Flow imported, Please refresh the Page!");

    // close modal immediately
    setImportOpen(false);
    setImportSection(null);

    // ⏱ reload after 2 seconds
    setTimeout(() => {
  router.refresh();
}, 2000);

  } catch (err) {
    console.error("Import flow error:", err);
    toast.error("Failed to import flow");
  }
}}



  onEditImport={(flowId) => {
    router.push(
      `/company/${company}/projects/${projectId}/planning/test-cases/${testCaseId}/edit-import/${flowId}`
    );
  }}

  onView={(flowId) => {
  router.push(
    `/company/${company}/projects/${projectId}/planning/test-cases/${testCaseId}/view/${flowId}?section=${importSection}`
  );
}}
/>

      )}
    </>
  );
}
