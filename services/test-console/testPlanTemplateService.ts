import { apiRequest } from "@/services/apiClient";
import { TestPlanTemplate } from "@/types/testPlanTemplate";

/* ----------------------------------
   List Templates
   GET /test-plan/projects/{project_id}/templates/list/
---------------------------------- */
export function listTemplates(projectId: number) {
    return apiRequest<TestPlanTemplate[]>(
        `/test-plan/projects/${projectId}/templates/list/`
    );
}

/* ----------------------------------
   Create Template
   POST /test-plan/projects/{project_id}/templates/
---------------------------------- */
export function createTemplate(
    projectId: number,
    payload: {
        name: string;
        description?: string;
    }
) {
    return apiRequest<TestPlanTemplate>(
        `/test-plan/projects/${projectId}/templates/`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}

/* ----------------------------------
   Update Template
   PUT /test-plan/projects/{project_id}/templates/{template_id}/update/
---------------------------------- */
export function updateTemplate(
    projectId: number,
    templateId: number,
    payload: {
        name: string;
        description?: string;
    }
) {
    return apiRequest<TestPlanTemplate>(
        `/test-plan/projects/${projectId}/templates/${templateId}/update/`,
        {
            method: "PUT",
            body: JSON.stringify(payload),
        }
    );
}

/* ----------------------------------
   Delete Template
   DELETE /test-plan/projects/{project_id}/templates/{template_id}/delete/
---------------------------------- */
export function deleteTemplate(
    projectId: number,
    templateId: number
) {
    return apiRequest<void>(
        `/test-plan/projects/${projectId}/templates/${templateId}/delete/`,
        {
            method: "DELETE",
        }
    );
}
