import { apiRequest } from "@/services/apiClient";
import type {
    PlanningItem,
    CreatePlanningItemPayload,
    PlanningDependency,
    TimeTrackingSession,
} from "@/types/testPlan";

const BASE = "/test-plan";

/* ==========================================
   PLANNING ITEM CRUD
   ========================================== */

export function listPlanningItems(projectId: number) {
    return apiRequest<PlanningItem[]>(
        `${BASE}/projects/${projectId}/planning-items/list/`
    );
}

export function getPlanningItemDetail(itemId: number) {
    return apiRequest<PlanningItem>(
        `${BASE}/planning-items/${itemId}/`
    );
}

export function createPlanningItem(
    projectId: number,
    payload: CreatePlanningItemPayload
) {
    return apiRequest<PlanningItem>(
        `${BASE}/projects/${projectId}/planning-items/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updatePlanningItem(
    itemId: number,
    payload: Partial<CreatePlanningItemPayload>
) {
    return apiRequest<PlanningItem>(
        `${BASE}/planning-items/${itemId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deletePlanningItem(itemId: number) {
    return apiRequest<void>(
        `${BASE}/planning-items/${itemId}/delete/`,
        { method: "DELETE" }
    );
}

/* ==========================================
   STATUS TRANSITIONS
   ========================================== */

export function transitionPlanningItem(
    itemId: number,
    payload: { to_state: number }
) {
    return apiRequest<PlanningItem>(
        `${BASE}/planning-items/${itemId}/transition/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

/* ==========================================
   DEPENDENCIES
   ========================================== */

export function createDependency(
    itemId: number,
    payload: { target_item: number; dependency_type: "BLOCKS" | "RELATES" }
) {
    return apiRequest<PlanningDependency>(
        `${BASE}/planning-items/${itemId}/dependencies/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function deleteDependency(dependencyId: number) {
    return apiRequest<void>(
        `${BASE}/dependencies/${dependencyId}/delete/`,
        { method: "DELETE" }
    );
}

/* ==========================================
   TIME TRACKING
   ========================================== */

export function startTimeTracking(itemId: number) {
    return apiRequest<TimeTrackingSession>(
        `${BASE}/planning-items/${itemId}/start-time/`,
        { method: "POST" }
    );
}

export function stopTimeTracking(itemId: number) {
    return apiRequest<TimeTrackingSession>(
        `${BASE}/planning-items/${itemId}/stop-time/`,
        { method: "POST" }
    );
}

export function getTimeSessions(itemId: number) {
    return apiRequest<TimeTrackingSession[]>(
        `${BASE}/planning-items/${itemId}/time-sessions/`
    );
}

/* ==========================================
   EXECUTION BINDING
   ========================================== */

export function bindExecution(
    itemId: number,
    payload: {
        flow?: number;
        test_case?: number;
        execution_mode?: string;
        auto_trigger?: boolean;
    }
) {
    return apiRequest<unknown>(
        `${BASE}/planning-items/${itemId}/bind-execution/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function deleteExecutionBinding(bindingId: number) {
    return apiRequest<void>(
        `${BASE}/execution-binding/${bindingId}/delete/`,
        { method: "DELETE" }
    );
}
