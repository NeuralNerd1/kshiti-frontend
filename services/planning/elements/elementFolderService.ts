import api from "@/services/api";

/* -----------------------------
   CREATE FOLDER
------------------------------ */
export async function createElementFolder(
  projectId: number,
  name: string,
  parentId?: number | null
) {
  const payload: any = {
    project_id: projectId,
    name: name,
  };

  if (parentId) {
    payload.parent_id = parentId;
  }

  const res = await api.post(
    "/planning/elements/folders/",
    payload
  );

  return res.data;
}

/* -----------------------------
   LIST
------------------------------ */
export async function listElementFolders(
  projectId: number
) {
  const res = await api.get(
    "/planning/elements/folders/list/",
    {
      params: { project_id: projectId },
    }
  );
  return res.data;
}

/* -----------------------------
   RENAME
------------------------------ */
export async function renameElementFolder(
  folderId: number,
  name: string
) {
  const res = await api.patch(
    `/planning/elements/folders/${folderId}/rename/`,
    { name }
  );
  return res.data;
}

/* -----------------------------
   DELETE
------------------------------ */
export async function deleteElementFolder(
  folderId: number
) {
  await api.delete(
    `/planning/elements/folders/${folderId}/delete/`
  );
}
