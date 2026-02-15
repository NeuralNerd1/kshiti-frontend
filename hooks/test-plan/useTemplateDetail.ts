"use client";

import { useEffect, useState, useCallback } from "react";

import { getTemplateDetail } from "@/services/test-plan/templateService";
import { listEntityTypes } from "@/services/test-plan/entityTypeService";
import { getEntitySchema, type EntitySchema } from "@/services/test-plan/schemaService";
import { listWorkflows, getWorkflowDetail } from "@/services/test-plan/workflowService";

import type {
    ProcessTemplate,
    PlanningEntityType,
    WorkflowDetail,
} from "@/types/testPlan";

type ApiError = { message: string; status: number };

export function useTemplateDetail(
    projectId: number | null | undefined,
    templateId: number | null | undefined
) {
    const [template, setTemplate] = useState<ProcessTemplate | null>(null);
    const [entityTypes, setEntityTypes] = useState<PlanningEntityType[]>([]);
    const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
    const [schema, setSchema] = useState<EntitySchema | null>(null);
    const [workflowDetail, setWorkflowDetail] = useState<WorkflowDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---- Load template + entity types ---- */
    const fetchTemplate = useCallback(async () => {
        if (!projectId || !templateId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [tmpl, entities] = await Promise.all([
                getTemplateDetail(projectId, templateId),
                listEntityTypes(projectId, templateId),
            ]);

            setTemplate(tmpl);
            setEntityTypes(entities);

            // Auto-select first entity
            if (entities.length > 0 && !selectedEntityId) {
                setSelectedEntityId(entities[0].id);
            }
        } catch (err) {
            const e = err as ApiError;
            setError(e.message || "Failed to load template");
        } finally {
            setLoading(false);
        }
    }, [projectId, templateId]);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    /* ---- Load schema + workflow when entity selected ---- */
    const fetchEntityData = useCallback(async () => {
        if (!projectId || !selectedEntityId) {
            setSchema(null);
            setWorkflowDetail(null);
            return;
        }

        try {
            const [schemaData, workflows] = await Promise.all([
                getEntitySchema(projectId, selectedEntityId),
                listWorkflows(projectId, selectedEntityId),
            ]);

            setSchema(schemaData);

            // Load workflow detail if one exists
            if (workflows.length > 0) {
                const detail = await getWorkflowDetail(projectId, workflows[0].id);
                setWorkflowDetail(detail);
            } else {
                setWorkflowDetail(null);
            }
        } catch (err) {
            console.error("Failed to load entity data:", err);
        }
    }, [projectId, selectedEntityId]);

    useEffect(() => {
        fetchEntityData();
    }, [fetchEntityData]);

    return {
        template,
        entityTypes,
        selectedEntityId,
        setSelectedEntityId,
        schema,
        workflowDetail,
        loading,
        error,
        refreshTemplate: fetchTemplate,
        refreshEntityData: fetchEntityData,
    };
}
