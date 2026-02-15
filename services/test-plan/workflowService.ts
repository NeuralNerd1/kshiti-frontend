import { apiRequest } from "@/services/apiClient";
import type {
    WorkflowDefinition,
    WorkflowState,
    WorkflowTransition,
    WorkflowDetail,
    CreateStatePayload,
    CreateTransitionPayload,
} from "@/types/testPlan";

const BASE = "/test-plan";

/* ==========================================
   WORKFLOW CRUD
   ========================================== */

export function listWorkflows(projectId: number, entityTypeId: number) {
    return apiRequest<WorkflowDefinition[]>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/workflows/`
    );
}

export function getWorkflowDetail(projectId: number, workflowId: number) {
    return apiRequest<WorkflowDetail>(
        `${BASE}/projects/${projectId}/workflows/${workflowId}/`
    );
}

export function createWorkflow(projectId: number, entityTypeId: number) {
    return apiRequest<WorkflowDefinition>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/workflow/`,
        { method: "POST" }
    );
}

export function updateWorkflow(
    projectId: number,
    workflowId: number,
    payload: { initial_state?: number | null }
) {
    return apiRequest<WorkflowDefinition>(
        `${BASE}/projects/${projectId}/workflow/${workflowId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deleteWorkflow(projectId: number, workflowId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/workflow/${workflowId}/delete/`,
        { method: "DELETE" }
    );
}

/* ==========================================
   WORKFLOW STATES
   ========================================== */

export function createState(
    projectId: number,
    workflowId: number,
    payload: CreateStatePayload
) {
    return apiRequest<WorkflowState>(
        `${BASE}/projects/${projectId}/workflow/${workflowId}/states/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updateState(
    projectId: number,
    stateId: number,
    payload: Partial<CreateStatePayload>
) {
    return apiRequest<WorkflowState>(
        `${BASE}/projects/${projectId}/states/${stateId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deleteState(projectId: number, stateId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/states/${stateId}/delete/`,
        { method: "DELETE" }
    );
}

/* ==========================================
   WORKFLOW TRANSITIONS
   ========================================== */

export function createTransition(
    projectId: number,
    workflowId: number,
    payload: CreateTransitionPayload
) {
    return apiRequest<WorkflowTransition>(
        `${BASE}/projects/${projectId}/workflow/${workflowId}/transitions/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updateTransition(
    projectId: number,
    transitionId: number,
    payload: Partial<CreateTransitionPayload>
) {
    return apiRequest<WorkflowTransition>(
        `${BASE}/projects/${projectId}/transitions/${transitionId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deleteTransition(projectId: number, transitionId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/transitions/${transitionId}/delete/`,
        { method: "DELETE" }
    );
}
