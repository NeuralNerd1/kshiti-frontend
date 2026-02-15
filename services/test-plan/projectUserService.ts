import { apiRequest } from "@/services/apiClient";

/* ==========================================
   TYPES
   ========================================== */

export type ProjectUser = {
    id: number;
    company_user_id: number;
    email: string;
    role: string;
    is_active: boolean;
};

/* ==========================================
   API
   ========================================== */

export function listProjectUsers(projectId: number): Promise<ProjectUser[]> {
    return apiRequest<ProjectUser[]>(
        `/company/projects/${projectId}/users/`
    );
}
