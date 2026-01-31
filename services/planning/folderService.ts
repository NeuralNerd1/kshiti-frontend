import { apiRequest } from "@/services/apiClient";
import { Folder } from "@/types/folder2";

export function fetchFolders(projectId: number) {
  return apiRequest<Folder[]>(
    `/planning/projects/${projectId}/folders/`
  );
}

export function createFolder(
  projectId: number,
  name: string,
  parentId: number | null
) {
  return apiRequest<Folder>(
    `/planning/projects/${projectId}/folders/`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        parent: parentId,
      }),
    }
  );
}

export function renameFolder(folderId: number, name: string) {
  return apiRequest(
    `/planning/folders/${folderId}/rename/`,
    {
      method: "POST",
      body: JSON.stringify({ name }),
    }
  );
}

export function deleteFolder(folderId: number) {
  return apiRequest(
    `/planning/folders/${folderId}/delete/`,
    { method: "DELETE" }
  );
}
export function listFolders(projectId: number) {
  return fetchFolders(projectId);
}