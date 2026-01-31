"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { PlanningFolder } from "@/types/planningFolderService";

export function useTestCaseFolders(projectId?: number) {
  const [folders, setFolders] = useState<PlanningFolder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    const { data } = await api.get(
      `/planning/test-cases/folders/list/?project_id=${projectId}`
    );
    setFolders(data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    canCreate: true,
    canEdit: true,
    refresh: fetchFolders,

    createFolder: async (
      name: string,
      parentId: number | null
    ) => {
      await api.post(
        "/planning/test-cases/folders/",
        {
          name,
          parent: parentId,
          project_id: projectId,
        }
      );
      fetchFolders();
    },

    renameFolder: async (id: number, name: string) => {
      await api.patch(
        `/planning/test-cases/folders/${id}/`,
        { name }
      );
      fetchFolders();
    },

    deleteFolder: async (id: number) => {
      await api.delete(
        `/planning/test-cases/folders/${id}/`
      );
      fetchFolders();
    },
  };
}
