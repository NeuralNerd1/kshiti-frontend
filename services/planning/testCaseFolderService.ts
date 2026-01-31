import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type TestCaseFolder = {
  id: number;
  name: string;
  path: string;
  parent: number | null;
  status: "ACTIVE" | "ARCHIVED";
  created_at: string;
};

/* ======================================================
   FOLDER SERVICES
====================================================== */

/**
 * Create folder or sub-folder
 */
export async function createTestCaseFolder(payload: {
  project_id: number;
  name: string;
  parent_id: number | null;
}) {
  const { data } = await api.post(
    "/planning/test-cases/folders/",
    payload
  );

  return data as TestCaseFolder;
}

/**
 * List all folders for project
 */
export async function listTestCaseFolders(
  projectId: number
) {
  const { data } = await api.get(
    `/planning/test-cases/folders/list/?project_id=${projectId}`
  );

  return data as TestCaseFolder[];
}

/**
 * Rename folder
 */
export async function renameTestCaseFolder(
  folderId: number,
  name: string
) {
  const { data } = await api.patch(
    `/planning/test-cases/folders/${folderId}/rename/`,
    { name }
  );

  return data as TestCaseFolder;
}

/**
 * Move folder
 */
export async function moveTestCaseFolder(
  folderId: number,
  parent_id: number | null
) {
  const { data } = await api.patch(
    `/planning/test-cases/folders/${folderId}/move/`,
    { parent_id }
  );

  return data as TestCaseFolder;
}

/**
 * Archive folder
 */
export async function archiveTestCaseFolder(
  folderId: number
) {
  const { data } = await api.post(
    `/planning/test-cases/folders/${folderId}/archive/`
  );

  return data;
}
