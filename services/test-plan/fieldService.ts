import { apiRequest } from "@/services/apiClient";
import type {
    EntityFieldDefinition,
    CreateFieldPayload,
} from "@/types/testPlan";

const BASE = "/test-plan";

/* ==========================================
   FIELD DEFINITION CRUD
   ========================================== */

export function listFields(projectId: number, entityTypeId: number) {
    return apiRequest<EntityFieldDefinition[]>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/fields/list/`
    );
}

export function createField(
    projectId: number,
    entityTypeId: number,
    payload: CreateFieldPayload
) {
    return apiRequest<EntityFieldDefinition>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/fields/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updateField(
    projectId: number,
    fieldId: number,
    payload: Partial<CreateFieldPayload>
) {
    return apiRequest<EntityFieldDefinition>(
        `${BASE}/projects/${projectId}/fields/${fieldId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deleteField(projectId: number, fieldId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/fields/${fieldId}/delete/`,
        { method: "DELETE" }
    );
}
