"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import api from "@/services/api";

import {
    ActionCategory,
    FlowStep,
} from "@/components/planning/builder/types";

/* ======================================================
   TYPES
====================================================== */

export type LocalTestCaseSection =
    | "pre_conditions"
    | "steps"
    | "expected_outcomes";

/* ======================================================
   LOCAL TEST CASE BUILDER HOOK
====================================================== */

export function useLocalTestCaseBuilder(testCaseId: number) {
    /* ======================================================
       CORE STATE
    ====================================================== */

    const [testCase, setTestCase] =
        useState<any>(null);

    const [registry, setRegistry] =
        useState<ActionCategory[]>([]);

    const [sections, setSections] = useState<
        Record<LocalTestCaseSection, FlowStep[]>
    >({
        pre_conditions: [],
        steps: [],
        expected_outcomes: [],
    });

    const [activeSection, setActiveSection] =
        useState<LocalTestCaseSection>("steps");

    const [selectedStepId, setSelectedStepId] =
        useState<string | null>(null);

    const [versions, setVersions] =
        useState<any[]>([]);

    const [currentVersion, setCurrentVersion] =
        useState<number | null>(null);

    const [dirtySections, setDirtySections] =
        useState<Record<LocalTestCaseSection, boolean>>({
            pre_conditions: false,
            steps: false,
            expected_outcomes: false,
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    /* ======================================================
       LOAD TEST CASE + REGISTRY
    ====================================================== */

    const load = useCallback(async () => {
        try {
            setLoading(true);

            const [registryRes, testCaseRes] =
                await Promise.all([
                    api.get("/planning/registry/actions/"),
                    api.get(
                        `/planning/local-test-cases/${testCaseId}/`
                    ),
                ]);

            /* --------------------------------
               REGISTRY NORMALIZATION
            -------------------------------- */

            const normalizedRegistry: ActionCategory[] =
                (registryRes.data || []).map(
                    (cat: any) => ({
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
                    })
                );

            setRegistry(normalizedRegistry);

            /* --------------------------------
               TEST CASE
            -------------------------------- */

            const tc = testCaseRes.data;

            setTestCase(tc.test_case);
            setVersions(tc.versions || []);

            const latest =
                tc.versions?.[0] || null;

            if (latest) {
                setCurrentVersion(
                    latest.version_number
                );

                setSections({
                    pre_conditions:
                        (latest.pre_conditions_json ||
                            []).map(normalizeStep),
                    steps:
                        (latest.steps_json || []).map(
                            normalizeStep
                        ),
                    expected_outcomes:
                        (
                            latest.expected_outcomes_json ||
                            []
                        ).map(normalizeStep),
                });
            }

            setDirtySections({
                pre_conditions: false,
                steps: false,
                expected_outcomes: false,
            });

            setSelectedStepId(null);
        } catch (err) {
            console.error(
                "Local test case builder load failed",
                err
            );

            setRegistry([]);
            setSections({
                pre_conditions: [],
                steps: [],
                expected_outcomes: [],
            });
        } finally {
            setLoading(false);
        }
    }, [testCaseId]);

    useEffect(() => {
        if (testCaseId) load();
    }, [testCaseId, load]);

    /* ======================================================
       NORMALIZE BACKEND STEP
    ====================================================== */

    function normalizeStep(step: any): FlowStep {
        return {
            step_id: uuid(),
            action_key: step.action_key,
            parameters: step.parameters || {},
            execution_notes: step.execution_notes || {
                before: [],
                after: [],
                on_error: [],
            },
        };
    }

    /* ======================================================
       DERIVED
    ====================================================== */

    const steps = sections[activeSection];

    /* ======================================================
       INTERNAL HELPERS
    ====================================================== */

    function markDirty(section: LocalTestCaseSection) {
        setDirtySections((prev) => ({
            ...prev,
            [section]: true,
        }));
    }

    function updateSectionSteps(
        newSteps: FlowStep[]
    ) {
        setSections((prev) => ({
            ...prev,
            [activeSection]: newSteps,
        }));

        markDirty(activeSection);
    }

    /* ======================================================
       STEP OPERATIONS
    ====================================================== */

    function addStep(action_key: string) {
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

        updateSectionSteps([...steps, newStep]);
        setSelectedStepId(newStep.step_id);
    }

    function updateStep(
        stepId: string,
        patch: Partial<FlowStep>
    ) {
        updateSectionSteps(
            steps.map((s) =>
                s.step_id === stepId
                    ? { ...s, ...patch }
                    : s
            )
        );
    }

    function removeStep(stepId: string) {
        updateSectionSteps(
            steps.filter((s) => s.step_id !== stepId)
        );

        setSelectedStepId((prev) =>
            prev === stepId ? null : prev
        );
    }

    /* ======================================================
       SAVE ACTIVE SECTION
    ====================================================== */

    const saveActiveSection = useCallback(
        async () => {
            try {
                setSaving(true);

                await api.post(
                    `/planning/local-test-cases/${testCaseId}/builder/save/`,
                    {
                        section: activeSection,
                        steps: sections[activeSection],
                    }
                );

                await load();

                setDirtySections((prev) => ({
                    ...prev,
                    [activeSection]: false,
                }));

                return true;
            } catch (err) {
                console.error(
                    "Save local test case section failed",
                    err
                );
                return false;
            } finally {
                setSaving(false);
            }
        },
        [
            testCaseId,
            activeSection,
            sections,
            load,
        ]
    );

    /* ======================================================
       EXPORT
    ====================================================== */

    return {
        loading,
        saving,

        testCase,
        registry,

        versions,
        currentVersion,

        activeSection,
        setActiveSection,

        steps,
        selectedStepId,
        setSelectedStepId,

        addStep,
        updateStep,
        removeStep,

        saveActiveSection,

        dirtySections,
    };
}
