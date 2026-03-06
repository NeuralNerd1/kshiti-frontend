import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type LocalTestCaseFolder = {
    id: number;
    name: string;
    path: string;
    parent: number | null;
    status: "ACTIVE" | "ARCHIVED";
    created_at: string;
};

/* ======================================================
   LOCAL TEST CASE FOLDER SERVICES
====================================================== */

/**
 * Create folder or sub-folder
 */
export async function createLocalTestCaseFolder(payload: {
    project_id: number;
    name: string;
    parent_id: number | null;
}) {
    const { data } = await api.post(
        "/planning/local-test-cases/folders/",
        payload
    );

    return data as LocalTestCaseFolder;
}

/**
 * List all folders for project (scoped to current user)
 */
export async function listLocalTestCaseFolders(
    projectId: number
) {
    const { data } = await api.get(
        `/planning/local-test-cases/folders/list/?project_id=${projectId}`
    );

    return data as LocalTestCaseFolder[];
}

/**
 * Rename folder
 */
export async function renameLocalTestCaseFolder(
    folderId: number,
    name: string
) {
    const { data } = await api.patch(
        `/planning/local-test-cases/folders/${folderId}/`,
        { name }
    );

    return data as LocalTestCaseFolder;
}

/**
 * Move folder
 */
export async function moveLocalTestCaseFolder(
    folderId: number,
    parent_id: number | null
) {
    const { data } = await api.patch(
        `/planning/local-test-cases/folders/${folderId}/move/`,
        { parent_id }
    );

    return data as LocalTestCaseFolder;
}

/**
 * Archive folder
 */
export async function archiveLocalTestCaseFolder(
    folderId: number
) {
    await api.delete(
        `/planning/local-test-cases/folders/${folderId}/`
    );
}
