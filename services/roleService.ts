import { apiRequest } from "./apiClient";

/**
 * List system + company roles.
 * READ-ONLY from frontend.
 * Requires: can_manage_roles
 */
export function getCompanyRoles() {
  return apiRequest<
    {
      id: number;
      name: string;
      description: string;
      is_system_role: boolean;
      permissions_json: Record<string, boolean>;
      company: number | null;
    }[]
  >("/company/roles/");
}
