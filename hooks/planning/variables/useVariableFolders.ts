"use client";

import { useEffect, useState } from "react";
import {
  getVariableFolders,
  createVariableFolder,
  updateVariableFolder,
  deleteVariableFolder,
  VariableFolder,
} from "@/services/planning/variables/variableFolderService";

export function useVariableFolders(
  projectId: number | null
) {
  const [folders, setFolders] = useState<
    VariableFolder[]
  >([]);

  const [loading, setLoading] = useState(false);

  /* ======================================================
     FETCH
  ====================================================== */

  const fetchFolders = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const data =
        await getVariableFolders(projectId);
      setFolders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [projectId]);

  /* ======================================================
     CREATE
  ====================================================== */

  const createFolder = async (
    name: string,
    parentId?: number
  ) => {
    if (!projectId) return;

    const folder =
      await createVariableFolder({
        project_id: projectId,
        name,
        parent_id: parentId,
      });

    setFolders((prev) => [...prev, folder]);
  };

  /* ======================================================
     RENAME
  ====================================================== */

  const renameFolder = async (
    id: number,
    name: string
  ) => {
    const updated =
      await updateVariableFolder(id, name);

    setFolders((prev) =>
      prev.map((f) =>
        f.id === id ? updated : f
      )
    );
  };

  /* ======================================================
     DELETE
  ====================================================== */

  const deleteFolder = async (id: number) => {
    await deleteVariableFolder(id);

    setFolders((prev) =>
      prev.filter(
        (f) => f.id !== id && f.parent_id !== id
      )
    );
  };

  /* ======================================================
     PERMISSIONS (same as Elements)
  ====================================================== */

  return {
    folders,
    loading,

    canCreate: true,
    canEdit: true,

    createFolder,
    renameFolder,
    deleteFolder,
  };
}
