"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/hooks/projects/useProject";

import {
  listTemplates,
  getTemplateDetail,
  listEntityTypes,
  getEntitySchema,
  listWorkflows,
  getWorkflowDetail,
  listPlanningItems,
  ProcessTemplate,
  EntityType,
  EntitySchemaResponse,
  WorkflowDetailResponse,
  PlanningItem,
} from "@/services/test-plan/test_template_service";

/* ======================================================
   TEMPLATE LIST
====================================================== */

export function useTemplates(projectId: number | null) {
  const { project } = useProject();

  const [templates, setTemplates] = useState<ProcessTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const canCreate =
    project?.permissions?.can_edit_templates === true;

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    listTemplates(projectId)
      .then((data) => {
        if (!cancelled) setTemplates(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return {
    templates,
    loading,
    canCreate,
    setTemplates,
  };
}

/* ======================================================
   TEMPLATE DETAIL
====================================================== */

export function useTemplateDetail(
  projectId: number | null,
  templateId: number | null
) {
  const [template, setTemplate] =
    useState<ProcessTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !templateId) return;

    let cancelled = false;

    getTemplateDetail(projectId, templateId)
      .then((data) => {
        if (!cancelled) setTemplate(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, templateId]);

  return {
    template,
    loading,
    setTemplate,
  };
}

/* ======================================================
   ENTITY TYPES
====================================================== */

export function useEntityTypes(
  projectId: number | null,
  templateId: number | null
) {
  const [entityTypes, setEntityTypes] =
    useState<EntityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !templateId) return;

    let cancelled = false;

    listEntityTypes(projectId, templateId)
      .then((data) => {
        if (!cancelled) setEntityTypes(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, templateId]);

  return {
    entityTypes,
    loading,
    setEntityTypes,
  };
}

/* ======================================================
   ENTITY SCHEMA
====================================================== */

export function useEntitySchema(
  projectId: number | null,
  entityTypeId: number | null
) {
  const [schema, setSchema] =
    useState<EntitySchemaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !entityTypeId) return;

    let cancelled = false;

    getEntitySchema(projectId, entityTypeId)
      .then((data) => {
        if (!cancelled) setSchema(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, entityTypeId]);

  return {
    schema,
    loading,
    setSchema,
  };
}

/* ======================================================
   WORKFLOW
====================================================== */

export function useWorkflow(
  projectId: number | null,
  entityTypeId: number | null
) {
  const [workflowList, setWorkflowList] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !entityTypeId) return;

    let cancelled = false;

    listWorkflows(projectId, entityTypeId)
      .then((data) => {
        if (!cancelled) setWorkflowList(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, entityTypeId]);

  return {
    workflowList,
    loading,
    setWorkflowList,
  };
}

export function useWorkflowDetail(
  projectId: number | null,
  workflowId: number | null
) {
  const [workflowDetail, setWorkflowDetail] =
    useState<WorkflowDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !workflowId) return;

    let cancelled = false;

    getWorkflowDetail(projectId, workflowId)
      .then((data) => {
        if (!cancelled) setWorkflowDetail(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, workflowId]);

  return {
    workflowDetail,
    loading,
    setWorkflowDetail,
  };
}

/* ======================================================
   PLANNING ITEMS
====================================================== */

export function usePlanningItems(
  projectId: number | null
) {
  const { project } = useProject();

  const [items, setItems] =
    useState<PlanningItem[]>([]);
  const [loading, setLoading] = useState(true);

  const canCreate =
    project?.permissions?.can_create_planning_items === true;

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    listPlanningItems(projectId)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return {
    items,
    loading,
    canCreate,
    setItems,
  };
}
