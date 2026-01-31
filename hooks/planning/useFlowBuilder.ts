"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import api from "@/services/api";

import {
  ActionCategory,
  FlowStep,
} from "@/components/planning/builder/types";

/* ======================================================
   FLOW BUILDER HOOK
====================================================== */

export function useFlowBuilder(flowId: number) {
  const [flow, setFlow] = useState<any>(null);
  const [registry, setRegistry] = useState<ActionCategory[]>([]);

  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [selectedStepId, setSelectedStepId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================================
     ✅ NEW STATE (SAFE ADDITIONS)
  ================================= */

  const [currentVersion, setCurrentVersion] =
    useState<number | null>(null);

  const [activeVersion, setActiveVersion] =
    useState<number | null>(null);

  const [dirty, setDirty] = useState(false);

  /* ======================================================
     LOAD FLOW + REGISTRY
  ====================================================== */

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [registryRes, flowRes] = await Promise.all([
        api.get("/planning/registry/actions/"),
        api.get(`/planning/flows/${flowId}/`),
      ]);

      /* --------------------------------
         REGISTRY NORMALIZATION
      --------------------------------- */

      const normalizedRegistry: ActionCategory[] =
        (registryRes.data || []).map((cat: any) => ({
          key: cat.key,
          name: cat.name,
          actions: Array.isArray(cat.actions)
            ? cat.actions.map((a: any) => ({
                action_key: a.action_key,
                action_name: a.action_name,
                description: a.description,
                parameter_schema:
                  a.parameter_schema || {},
              }))
            : [],
        }));

      setRegistry(normalizedRegistry);

      /* --------------------------------
         FLOW
      --------------------------------- */

      setFlow(flowRes.data);

    

      // ======================================================
// LOAD STEPS FROM CURRENT VERSION
// ======================================================

const currentVersion =
  flowRes.data?.flow?.current_version ?? null;

setCurrentVersion(currentVersion);
setActiveVersion(currentVersion);
setDirty(false);

const versions = flowRes.data?.versions || [];

const activeVersion = versions.find(
  (v: any) => v.version_number === currentVersion
);

const backendSteps = activeVersion?.steps_json || [];

const normalizedSteps: FlowStep[] = backendSteps.map(
  (step: any) => ({
    step_id: uuid(),
    action_key: step.action_key,
    parameters: step.parameters || {},
    execution_notes: step.execution_notes || {
      before: [],
      after: [],
      on_error: [],
    },
  })
);


setSteps(normalizedSteps);

    } catch (err) {
      console.error("Flow builder load failed", err);
      setFlow(null);
      setRegistry([]);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  }, [flowId]);

  useEffect(() => {
    if (flowId) load();
  }, [flowId, load]);

  /* ======================================================
     ADD STEP
  ====================================================== */

  const addStep = useCallback((action_key: string) => {
    const newStep: FlowStep = {
  step_id: uuid(),
  action_key,
  parameters: {},
  execution_notes: {
    before: [],
    after: [],
    on_error: [],
  },
};

    setSteps((prev) => [...prev, newStep]);
    setSelectedStepId(newStep.step_id);

    // ✅ mark dirty
    setDirty(true);
  }, []);

  /* ======================================================
     UPDATE STEP
  ====================================================== */

  const updateStep = useCallback(
    (stepId: string, patch: Partial<FlowStep>) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.step_id === stepId
            ? { ...s, ...patch }
            : s
        )
      );

      // ✅ mark dirty
      setDirty(true);
    },
    []
  );


  function sanitizeParameters(params: Record<string, any>) {
  const cleaned: Record<string, any> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (
      value === "" ||
      value === undefined ||
      value === null
    ) {
      return;
    }

    // ensure numbers are numbers
    if (typeof value === "string" && !isNaN(Number(value))) {
      cleaned[key] = Number(value);
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}


  /* ======================================================
     SAVE VERSION (BACKEND SAFE)
  ====================================================== */

  const saveVersion = useCallback(async () => {
  try {
    setSaving(true);

    const payload: any = {
      steps_json: steps.map((step) => ({
        action_key: step.action_key,
        parameters: sanitizeParameters(step.parameters),
        execution_notes: step.execution_notes || {
  before: [],
  after: [],
  on_error: [],
},
      })),
    };

    // ⚠️ CRITICAL FIX
    if (currentVersion !== null) {
      payload.version = currentVersion;
    }

    const res = await api.post(
      `/planning/flows/${flowId}/versions/`,
      payload
    );

    const newVersion = res.data?.version_number ?? null;

    if (newVersion !== null) {
      setCurrentVersion(newVersion);
      setActiveVersion(newVersion);
      setDirty(false);
    }

    return true;
  } catch (err) {
    console.error("Save failed", err);
    return false;
  } finally {
    setSaving(false);
  }
}, [flowId, steps, currentVersion]);

const removeStep = useCallback((stepId: string) => {
  setSteps((prev) =>
    prev.filter((s) => s.step_id !== stepId)
  );

  setSelectedStepId((prev) =>
    prev === stepId ? null : prev
  );

  setDirty(true);
}, []);





  /* ====================================================== */

  return {
    // existing
    flow,
    registry,

    steps,
    selectedStepId,

    loading,
    saving,

    // ✅ new but non-breaking
    dirty,
    currentVersion,
    activeVersion,

    addStep,
    updateStep,
    removeStep,
    setSelectedStepId,

    saveVersion,
    reload: load,
  };
}
