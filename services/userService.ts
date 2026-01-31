import { apiRequest } from "./apiClient";

/**
 * List users in the company.
 * Requires: can_manage_users
 */
export function getCompanyUsers() {
  return apiRequest<
    {
      id: number;
      user_id: number;
      email: string;
      role_id: number;
      is_active: boolean;
    }[]
  >("/company/users/");
}

/**
 * Add an existing user to the company.
 * Backend requires:
 * - user_id
 * - role_id
 */
export function addCompanyUser(payload: {
  user_id: number;
  role_id: number;
}) {
  return apiRequest("/company/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
