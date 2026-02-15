import { apiRequest } from "./apiClient";

/**
 * List projects visible to the current user.
 */
export function getCompanyProjects() {
  return apiRequest<
    {
      id: number;
      name: string;
      description: string;
      max_team_members: number;
      project_admin: number;
      status: string;
      created_at: string;
    }[]
  >("/company/projects/");
}

/**
 * Create a new project.
 */
export function createCompanyProject(payload: {
  name: string;
  description?: string;
  max_team_members: number;
  project_admin: number;
}) {
  return apiRequest("/company/projects/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Archive a project.
 */
export function archiveProject(projectId: number) {
  return apiRequest(`/company/projects/${projectId}/archive/`, {
    method: "POST",
  });
}

/**
 * ✅ PROJECT CONTEXT (SOURCE OF TRUTH)
 * Used by ProjectShell / Planning / Sidebar / Header
 */
export function getProject(projectId: number | string) {
  return apiRequest<{
    id: number;
    name: string;
    description: string;

    // project configuration
    flows_enabled: boolean;
    test_cases_enabled: boolean;
    builder_enabled: boolean;
    execution_enabled: boolean;
    reports_enabled: boolean;
    test_planning_enabled: boolean;
permissions?: Record<string, boolean>;

    status: string;
  }>(`/company/projects/${projectId}/`);
}

/**
 * ⚠️ DEPRECATED — DO NOT USE
 * There is NO backend endpoint for this.
 * Kept temporarily to avoid breaking imports.
 */
export function getProjectScoped(_projectId: number | string) {
  throw new Error(
    "getProjectScoped is deprecated. Use getProject(projectId) instead."
  );
}
