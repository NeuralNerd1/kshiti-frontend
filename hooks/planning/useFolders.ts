"use client";

import { useEffect, useState, useCallback } from "react";

import {
  listPlanningFolders,
  createPlanningFolder,
  renamePlanningFolder,
  deletePlanningFolder,
} from "@/services/planning/planningFolderService";

type FolderError = {
  message: string;
  status: number;
};
import { PlanningFolder } from "@/types/planningFolderService";

export function useFolders(projectId?: number) {
  /* ----------------------------
     STATE (ALWAYS DECLARED)
  ----------------------------- */

  const [folders, setFolders] = useState<PlanningFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Permission inference (optimistic by default)
  const [canCreate, setCanCreate] = useState<boolean>(true);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  /* ----------------------------
     FETCH FOLDERS
  ----------------------------- */

  const fetchFolders = useCallback(async () => {
    if (!projectId) {
      setFolders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listPlanningFolders(projectId);
      setFolders(data);
    } catch (err) {
      const apiErr = err as FolderError;

      if (apiErr.status === 403) {
        setError("You don’t have access to planning");
      } else {
        setError(apiErr.message || "Failed to load folders");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /* ----------------------------
     EFFECT (STABLE)
  ----------------------------- */

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  /* ----------------------------
     CREATE FOLDER
  ----------------------------- */

  const createFolder = async (
    name: string,
    parentId?: number | null
  ) => {
    if (!projectId || !canCreate) return;

    try {
      const folder = await createPlanningFolder(projectId, {
        name,
        parent_id: parentId ?? null,
      });

      setFolders((prev) => [...prev, folder]);
    } catch (err) {
      const apiErr = err as FolderError;

      if (apiErr.status === 403) {
        setCanCreate(false);
      } else {
        throw err;
      }
    }
  };

  /* ----------------------------
     RENAME FOLDER
  ----------------------------- */

  const renameFolder = async (
    folderId: number,
    name: string
  ) => {
    if (!canEdit) return;

    try {
      const updated = await renamePlanningFolder(folderId, { name });

      setFolders((prev) =>
        prev.map((f) => (f.id === folderId ? updated : f))
      );
    } catch (err) {
      const apiErr = err as FolderError;

      if (apiErr.status === 403) {
        setCanEdit(false);
      } else {
        throw err;
      }
    }
  };

  /* ----------------------------
     DELETE FOLDER
  ----------------------------- */

  const deleteFolder = async (folderId: number) => {
    if (!canEdit) return;

    try {
      await deletePlanningFolder(folderId);

      setFolders((prev) =>
        prev.filter((f) => f.id !== folderId)
      );
    } catch (err) {
      const apiErr = err as FolderError;

      if (apiErr.status === 403) {
        setCanEdit(false);
      } else {
        throw err;
      }
    }
  };

  /* ----------------------------
     RETURN API
  ----------------------------- */

  return {
    folders,
    loading,
    error,

    // inferred permissions
    canCreate,
    canEdit,

    // actions
    refresh: fetchFolders,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}
