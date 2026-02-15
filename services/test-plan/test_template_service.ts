import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type TemplateStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CREATED";

export type ProcessTemplate = {
  id: number;
  name: string;
  description?: string;
  version_number: number;
  status: TemplateStatus;
  is_locked: boolean;
  created_by: number;
  reviewer: number | null;
  rejection_note: string | null;
  created_at: string;
  updated_at: string;
};

export type EntityType = {
  id: number;
  internal_key: string;
  display_name: string;
  level_order: number;
  allow_children: boolean;
  allow_execution_binding: boolean;
  allow_dependencies: boolean;
  allow_time_tracking: boolean;
};

export type EntitySchemaResponse = {
  entity: {
    id: number;
    display_name: string;
    level_order: number;
  };
  system_fields: any[];
  default_template_fields: any[];
  custom_fields: any[];
};

export type WorkflowState = {
  id: number;
  name: string;
  order: number;
  is_final: boolean;
};

export type WorkflowTransition = {
  id: number;
  from_state: number;
  to_state: number;
};

export type WorkflowDetailResponse = {
  workflow: any;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
};

export type PlanningItem = {
  id: number;
  project: number;
  entity_type: number;
  parent: number | null;
  status: number;
  owner: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};


/* ======================================================
   TEMPLATE SERVICES
====================================================== */

export async function createTemplate(
  projectId: number,
  payload: {
    name: string;
    description?: string;
  }
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/`,
    payload
  );

  return data as ProcessTemplate;
}

export async function listTemplates(
  projectId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/templates/list/`
  );

  return data as ProcessTemplate[];
}

export async function getTemplateDetail(
  projectId: number,
  templateId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/templates/${templateId}/`
  );

  return data as ProcessTemplate;
}

export async function updateTemplate(
  projectId: number,
  templateId: number,
  payload: {
    name: string;
    description?: string;
  }
) {
  const { data } = await api.put(
    `/test-plan/projects/${projectId}/templates/${templateId}/update/`,
    payload
  );

  return data as ProcessTemplate;
}

export async function deleteTemplate(
  projectId: number,
  templateId: number
) {
  await api.delete(
    `/test-plan/projects/${projectId}/templates/${templateId}/delete/`
  );
}

/* ======================================================
   TEMPLATE LIFECYCLE
====================================================== */

export async function submitTemplate(
  projectId: number,
  templateId: number
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/submit/`
  );

  return data;
}

export async function approveTemplate(
  projectId: number,
  templateId: number
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/approve/`
  );

  return data;
}

export async function rejectTemplate(
  projectId: number,
  templateId: number,
  payload: { rejection_note: string }
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/reject/`,
    payload
  );

  return data;
}

export async function createFinalTemplate(
  projectId: number,
  templateId: number
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/create-final/`
  );

  return data;
}

/* ======================================================
   BOOTSTRAP
====================================================== */

export async function bootstrapTemplate(
  projectId: number,
  templateId: number
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/bootstrap-default/`
  );

  return data;
}

/* ======================================================
   ENTITY TYPES
====================================================== */

export async function createEntityType(
  projectId: number,
  templateId: number,
  payload: Partial<EntityType>
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/templates/${templateId}/entity-types/`,
    payload
  );

  return data as EntityType;
}

export async function listEntityTypes(
  projectId: number,
  templateId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/templates/${templateId}/entity-types/list/`
  );

  return data as EntityType[];
}

export async function updateEntityType(
  projectId: number,
  entityTypeId: number,
  payload: Partial<EntityType>
) {
  const { data } = await api.put(
    `/test-plan/projects/${projectId}/entity-types/${entityTypeId}/update/`,
    payload
  );

  return data as EntityType;
}

export async function deleteEntityType(
  projectId: number,
  entityTypeId: number
) {
  await api.delete(
    `/test-plan/projects/${projectId}/entity-types/${entityTypeId}/delete/`
  );
}

/* ======================================================
   ENTITY SCHEMA
====================================================== */

export async function getEntitySchema(
  projectId: number,
  entityTypeId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/entity-types/${entityTypeId}/schema/`
  );

  return data as EntitySchemaResponse;
}

/* ======================================================
   WORKFLOW
====================================================== */

export async function listWorkflows(
  projectId: number,
  entityTypeId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/entity-types/${entityTypeId}/workflows/`
  );

  return data;
}

export async function getWorkflowDetail(
  projectId: number,
  workflowId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/workflows/${workflowId}/`
  );

  return data as WorkflowDetailResponse;
}

export async function createWorkflowState(
  projectId: number,
  workflowId: number,
  payload: {
    name: string;
    order: number;
    is_final?: boolean;
  }
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/workflows/${workflowId}/states/`,
    payload
  );

  return data as WorkflowState;
}

export async function createWorkflowTransition(
  projectId: number,
  workflowId: number,
  payload: {
    from_state: number;
    to_state: number;
  }
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/workflows/${workflowId}/transitions/`,
    payload
  );

  return data as WorkflowTransition;
}

/* ======================================================
   PLANNING ITEMS
====================================================== */

export async function createPlanningItem(
  projectId: number,
  payload: {
    entity_type: number;
    parent?: number | null;
    owner: number;
    assigned_users?: number[];
    start_date?: string;
    end_date?: string;
    field_values?: Record<string, any>;
  }
) {
  const { data } = await api.post(
    `/test-plan/projects/${projectId}/planning-items/`,
    payload
  );

  return data as PlanningItem;
}

export async function listPlanningItems(
  projectId: number
) {
  const { data } = await api.get(
    `/test-plan/projects/${projectId}/planning-items/`
  );

  return data as PlanningItem[];
}

export async function getPlanningItemDetail(
  itemId: number
) {
  const { data } = await api.get(
    `/test-plan/planning-items/${itemId}/`
  );

  return data as PlanningItem;
}

export async function updatePlanningItem(
  itemId: number,
  payload: any
) {
  const { data } = await api.put(
    `/test-plan/planning-items/${itemId}/`,
    payload
  );

  return data as PlanningItem;
}

export async function deletePlanningItem(
  itemId: number
) {
  await api.delete(
    `/test-plan/planning-items/${itemId}/`
  );
}
