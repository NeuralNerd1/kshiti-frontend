"use client";

import { useEffect, useState } from "react";
import {
  getVariables,
  Variable,
} from "@/services/planning/variables/variableService";

export function useVariables(
  projectId: number | null,
  folderId?: number
) {
  const [variables, setVariables] =
    useState<Variable[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* ======================================================
     FETCH VARIABLES
  ====================================================== */

  const fetchVariables = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const params: {
        project_id: number;
        folder_id?: number;
      } = {
        project_id: projectId,
      };

      // ✅ ONLY send folder_id when folder is selected
      if (folderId) {
        params.folder_id = folderId;
      }

      const data = await getVariables(params);

      setVariables(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariables();
  }, [projectId, folderId]);

  return {
    variables,
    loading,
    refresh: fetchVariables,
  };
}
