"use client";

import { useEffect, useState, useCallback } from "react";

import {
    listTemplates,
    createTemplate as createTemplateApi,
    updateTemplate as updateTemplateApi,
    deleteTemplate as deleteTemplateApi,
    bootstrapTemplate as bootstrapTemplateApi,
} from "@/services/test-plan/templateService";

import type { ProcessTemplate, CreateTemplatePayload } from "@/types/testPlan";

type ApiError = { message: string; status: number };

export function useTemplates(projectId?: number | null) {
    const [templates, setTemplates] = useState<ProcessTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---- FETCH ---- */
    const fetchTemplates = useCallback(async () => {
        if (!projectId) {
            setTemplates([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await listTemplates(projectId);
            setTemplates(data);
        } catch (err) {
            const e = err as ApiError;
            setError(
                e.status === 403
                    ? "You don't have access to test plan templates"
                    : e.message || "Failed to load templates"
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    /* ---- CREATE (+ server bootstrap) ---- */
    const createTemplate = async (payload: CreateTemplatePayload) => {
        if (!projectId) return null;

        const template = await createTemplateApi(projectId, payload);

        // Server-side bootstrap — creates entities + fields + workflows
        try {
            await bootstrapTemplateApi(projectId, template.id);
        } catch (bootstrapErr) {
            console.warn("Bootstrap warning:", bootstrapErr);
            // Template is still created even if bootstrap fails
        }

        setTemplates((prev) => [template, ...prev]);
        return template;
    };

    /* ---- UPDATE ---- */
    const updateTemplate = async (
        templateId: number,
        payload: CreateTemplatePayload
    ) => {
        if (!projectId) return null;

        const updated = await updateTemplateApi(projectId, templateId, payload);
        setTemplates((prev) =>
            prev.map((t) => (t.id === templateId ? updated : t))
        );
        return updated;
    };

    /* ---- DELETE ---- */
    const deleteTemplate = async (templateId: number) => {
        if (!projectId) return;

        await deleteTemplateApi(projectId, templateId);
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    };

    return {
        templates,
        loading,
        error,
        refresh: fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
}
