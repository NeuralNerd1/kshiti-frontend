"use client";

import { useState, useCallback } from "react";

import {
    createState as createStateApi,
    updateState as updateStateApi,
    deleteState as deleteStateApi,
    createTransition as createTransitionApi,
    updateTransition as updateTransitionApi,
    deleteTransition as deleteTransitionApi,
} from "@/services/test-plan/workflowService";

import type {
    WorkflowState,
    WorkflowTransition,
    CreateStatePayload,
    CreateTransitionPayload,
} from "@/types/testPlan";

type ApiError = { message: string; status: number };

export function useWorkflow(
    projectId: number | null | undefined,
    workflowId: number | null | undefined
) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ---- States ---- */

    const addState = useCallback(
        async (payload: CreateStatePayload): Promise<WorkflowState | null> => {
            if (!projectId || !workflowId) return null;

            setSaving(true);
            setError(null);

            try {
                const state = await createStateApi(projectId, workflowId, payload);
                return state;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to create state");
                return null;
            } finally {
                setSaving(false);
            }
        },
        [projectId, workflowId]
    );

    const editState = useCallback(
        async (
            stateId: number,
            payload: Partial<CreateStatePayload>
        ): Promise<WorkflowState | null> => {
            if (!projectId) return null;

            setSaving(true);
            setError(null);

            try {
                const state = await updateStateApi(projectId, stateId, payload);
                return state;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to update state");
                return null;
            } finally {
                setSaving(false);
            }
        },
        [projectId]
    );

    const removeState = useCallback(
        async (stateId: number): Promise<boolean> => {
            if (!projectId) return false;

            setSaving(true);
            setError(null);

            try {
                await deleteStateApi(projectId, stateId);
                return true;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to delete state");
                return false;
            } finally {
                setSaving(false);
            }
        },
        [projectId]
    );

    /* ---- Transitions ---- */

    const addTransition = useCallback(
        async (
            payload: CreateTransitionPayload
        ): Promise<WorkflowTransition | null> => {
            if (!projectId || !workflowId) return null;

            setSaving(true);
            setError(null);

            try {
                const transition = await createTransitionApi(
                    projectId,
                    workflowId,
                    payload
                );
                return transition;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to create transition");
                return null;
            } finally {
                setSaving(false);
            }
        },
        [projectId, workflowId]
    );

    const editTransition = useCallback(
        async (
            transitionId: number,
            payload: Partial<CreateTransitionPayload>
        ): Promise<WorkflowTransition | null> => {
            if (!projectId) return null;

            setSaving(true);
            setError(null);

            try {
                const transition = await updateTransitionApi(
                    projectId,
                    transitionId,
                    payload
                );
                return transition;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to update transition");
                return null;
            } finally {
                setSaving(false);
            }
        },
        [projectId]
    );

    const removeTransition = useCallback(
        async (transitionId: number): Promise<boolean> => {
            if (!projectId) return false;

            setSaving(true);
            setError(null);

            try {
                await deleteTransitionApi(projectId, transitionId);
                return true;
            } catch (err) {
                const e = err as ApiError;
                setError(e.message || "Failed to delete transition");
                return false;
            } finally {
                setSaving(false);
            }
        },
        [projectId]
    );

    return {
        saving,
        error,
        addState,
        editState,
        removeState,
        addTransition,
        editTransition,
        removeTransition,
    };
}
