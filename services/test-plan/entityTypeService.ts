import { apiRequest } from "@/services/apiClient";
import type {
    PlanningEntityType,
    CreateEntityTypePayload,
} from "@/types/testPlan";

const BASE = "/test-plan";

/* ==========================================
   ENTITY TYPE CRUD
   ========================================== */

export function listEntityTypes(projectId: number, templateId: number) {
    return apiRequest<PlanningEntityType[]>(
        `${BASE}/projects/${projectId}/templates/${templateId}/entity-types/list/`
    );
}

export function createEntityType(
    projectId: number,
    templateId: number,
    payload: CreateEntityTypePayload
) {
    return apiRequest<PlanningEntityType>(
        `${BASE}/projects/${projectId}/templates/${templateId}/entity-types/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updateEntityType(
    projectId: number,
    entityTypeId: number,
    payload: Partial<CreateEntityTypePayload>
) {
    return apiRequest<PlanningEntityType>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/update/`,
        { method: "PATCH", body: JSON.stringify(payload) }
    );
}

export function deleteEntityType(projectId: number, entityTypeId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/delete/`,
        { method: "DELETE" }
    );
}
