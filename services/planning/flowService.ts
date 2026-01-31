import { apiRequest } from "@/services/apiClient";
import { Flow } from "@/types/planning";

/* ----------------------------------
   Get flows
   - All flows (All Flows)
   - Folder-specific flows
---------------------------------- */
export function getFlows(
  projectId: number,
  folderId?: number
) {
  const query = folderId
    ? `?folder_id=${folderId}`
    : "";

  return apiRequest<Flow[]>(
    `/planning/projects/${projectId}/flows/${query}`
  );
}

/* ----------------------------------
   Create flow
   - Optionally inside a folder
---------------------------------- */
export function createFlow(
  projectId: number,
  payload: {
    name: string;
    description?: string;
    folder_id?: number;
  }
) {
  return apiRequest<Flow>(
    `/planning/projects/${projectId}/flows/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/* ----------------------------------
   Update flow (name / description)
---------------------------------- */
export function updateFlow(
  flowId: number,
  payload: {
    name?: string;
    description?: string;
  }
) {
  return apiRequest<Flow>(
    `/planning/flows/${flowId}/edit/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

/* ----------------------------------
   Delete flow
---------------------------------- */
export function deleteFlow(flowId: number) {
  return apiRequest<void>(
    `/planning/flows/${flowId}/delete/`,
    {
      method: "DELETE",
    }
  );
}

/* ----------------------------------
   Archive flow
---------------------------------- */
export function archiveFlow(flowId: number) {
  return apiRequest<void>(
    `/planning/flows/${flowId}/archive/`,
    {
      method: "POST",
    }
  );
}

/* ----------------------------------
   Create new flow version
---------------------------------- */
export function createFlowVersion(
  flowId: number,
  payload: {
    execution_notes: string;
  }
) {
  return apiRequest(
    `/planning/flows/${flowId}/versions/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/* ----------------------------------
   Rollback flow version
---------------------------------- */
export function rollbackFlowVersion(
  flowId: number,
  versionNumber: number
) {
  return apiRequest(
    `/planning/flows/${flowId}/versions/${versionNumber}/rollback/`,
    {
      method: "POST",
    }
  );
}
