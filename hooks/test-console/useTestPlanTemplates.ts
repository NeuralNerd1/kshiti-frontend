"use client";

import { useEffect, useState, useCallback } from "react";

import {
    listTemplates,
    createTemplate as createTemplateApi,
    updateTemplate as updateTemplateApi,
    deleteTemplate as deleteTemplateApi,
} from "@/services/test-console/testPlanTemplateService";

import { TestPlanTemplate } from "@/types/testPlanTemplate";

type ApiError = {
    message: string;
    status: number;
};

export function useTestPlanTemplates(projectId?: number | null) {
    /* ----------------------------
       STATE
    ----------------------------- */
    const [templates, setTemplates] = useState<TestPlanTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /* ----------------------------
       FETCH TEMPLATES
    ----------------------------- */
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
            const apiErr = err as ApiError;

            if (apiErr.status === 403) {
                setError("You don't have access to test plan templates");
            } else {
                setError(apiErr.message || "Failed to load templates");
            }
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    /* ----------------------------
       EFFECT
    ----------------------------- */
    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    /* ----------------------------
       CREATE TEMPLATE
    ----------------------------- */
    const createTemplate = async (payload: {
        name: string;
        description?: string;
    }) => {
        if (!projectId) return null;

        const template = await createTemplateApi(projectId, payload);
        setTemplates((prev) => [template, ...prev]);
        return template;
    };

    /* ----------------------------
       UPDATE TEMPLATE
    ----------------------------- */
    const updateTemplate = async (
        templateId: number,
        payload: {
            name: string;
            description?: string;
        }
    ) => {
        if (!projectId) return null;

        const updated = await updateTemplateApi(projectId, templateId, payload);
        setTemplates((prev) =>
            prev.map((t) => (t.id === templateId ? updated : t))
        );
        return updated;
    };

    /* ----------------------------
       DELETE TEMPLATE
    ----------------------------- */
    const deleteTemplate = async (templateId: number) => {
        if (!projectId) return;

        await deleteTemplateApi(projectId, templateId);
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    };

    /* ----------------------------
       RETURN API
    ----------------------------- */
    return {
        templates,
        loading,
        error,
        setTemplates,

        // actions
        refresh: fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
}
