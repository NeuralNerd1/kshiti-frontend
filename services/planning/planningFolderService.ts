import { apiRequest } from "@/services/apiClient";

export type PlanningFolder = {
  id: number;
  name: string;
  path: string;
  parent: number | null;
};

/* ============================
   LIST FOLDERS
============================ */

export async function listPlanningFolders(
  projectId: number
): Promise<PlanningFolder[]> {
  return apiRequest<PlanningFolder[]>(
    `/planning/projects/${projectId}/folders/`,
    { method: "GET" }
  );
}

/* ============================
   CREATE FOLDER
============================ */

export async function createPlanningFolder(
  projectId: number,
  payload: { name: string; parent_id?: number | null }
): Promise<PlanningFolder> {
  return apiRequest<PlanningFolder>(
    `/planning/projects/${projectId}/folders/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/* ============================
   RENAME FOLDER
============================ */

export async function renamePlanningFolder(
  folderId: number,
  payload: { name: string }
): Promise<PlanningFolder> {
  return apiRequest<PlanningFolder>(
    `/planning/folders/${folderId}/rename/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

/* ============================
   DELETE FOLDER
============================ */

export async function deletePlanningFolder(
  folderId: number
): Promise<void> {
  await apiRequest<void>(
    `/planning/folders/${folderId}/delete/`,
    { method: "DELETE" }
  );
}
