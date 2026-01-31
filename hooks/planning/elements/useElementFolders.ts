import { useEffect, useState } from "react";
import {
  createElementFolder,
  listElementFolders,
  renameElementFolder,
  deleteElementFolder,
} from "@/services/planning/elements/elementFolderService";

export function useElementFolders(
  projectId?: number | null
) {
  const [folders, setFolders] = useState<any[]>([]);

  const refresh = async () => {
    if (!projectId) return;
    const data = await listElementFolders(projectId);
    setFolders(data);
  };

  useEffect(() => {
    refresh();
  }, [projectId]);

  return {
    folders,

    /* -----------------------------
       CREATE
    ------------------------------ */
    createFolder: async (
      name: string,
      parentId?: number
    ) => {
      if (!projectId || !name?.trim()) {
        throw new Error("Folder name required");
      }

      await createElementFolder(
        projectId,
        name.trim(),
        parentId ?? null
      );

      await refresh();
    },

    /* -----------------------------
       RENAME
    ------------------------------ */
    renameFolder: async (
      folderId: number,
      name: string
    ) => {
      await renameElementFolder(
        folderId,
        name.trim()
      );
      await refresh();
    },

    /* -----------------------------
       DELETE
    ------------------------------ */
    deleteFolder: async (folderId: number) => {
      await deleteElementFolder(folderId);
      await refresh();
    },

    canCreate: true,
    canEdit: true,
  };
}
