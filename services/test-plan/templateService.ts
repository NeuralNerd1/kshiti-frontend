import { apiRequest } from "@/services/apiClient";
import type {
    ProcessTemplate,
    CreateTemplatePayload,
    BootstrapSummary,
    ProjectTemplateBinding,
} from "@/types/testPlan";

const BASE = "/test-plan";

/* ==========================================
   TEMPLATE CRUD
   ========================================== */

export function listTemplates(projectId: number) {
    return apiRequest<ProcessTemplate[]>(
        `${BASE}/projects/${projectId}/templates/list/`
    );
}

export function getTemplateDetail(projectId: number, templateId: number) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/`
    );
}

export function createTemplate(projectId: number, payload: CreateTemplatePayload) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/`,
        { method: "POST", body: JSON.stringify(payload) }
    );
}

export function updateTemplate(
    projectId: number,
    templateId: number,
    payload: CreateTemplatePayload
) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/update/`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

export function deleteTemplate(projectId: number, templateId: number) {
    return apiRequest<void>(
        `${BASE}/projects/${projectId}/templates/${templateId}/delete/`,
        { method: "DELETE" }
    );
}

/* ==========================================
   BOOTSTRAP (SERVER-SIDE)
   ========================================== */

export function bootstrapTemplate(projectId: number, templateId: number) {
    return apiRequest<BootstrapSummary>(
        `${BASE}/projects/${projectId}/templates/${templateId}/bootstrap-default/`,
        { method: "POST" }
    );
}

/* ==========================================
   TEMPLATE STATUS ACTIONS
   ========================================== */

export function submitTemplate(projectId: number, templateId: number) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/submit/`,
        { method: "POST" }
    );
}

export function assignReviewer(
    projectId: number,
    templateId: number,
    reviewerId: number
) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/assign-reviewer/`,
        { method: "POST", body: JSON.stringify({ reviewer_id: reviewerId }) }
    );
}

export function approveTemplate(projectId: number, templateId: number) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/approve/`,
        { method: "POST" }
    );
}

export function rejectTemplate(
    projectId: number,
    templateId: number,
    note: string
) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/reject/`,
        { method: "POST", body: JSON.stringify({ note }) }
    );
}

export function createFinalTemplate(projectId: number, templateId: number) {
    return apiRequest<ProcessTemplate>(
        `${BASE}/projects/${projectId}/templates/${templateId}/create/`,
        { method: "POST" }
    );
}

/* ==========================================
   TEMPLATE ACTIVATION
   ========================================== */

export function activateTemplate(projectId: number, templateId: number) {
    return apiRequest<ProjectTemplateBinding>(
        `${BASE}/projects/${projectId}/activate-template/${templateId}/`,
        { method: "POST" }
    );
}

/* ==========================================
   PENDING REVIEWS
   ========================================== */

export function listPendingReviews(projectId: number) {
    return apiRequest<ProcessTemplate[]>(
        `${BASE}/projects/${projectId}/templates/pending-reviews/`
    );
}
