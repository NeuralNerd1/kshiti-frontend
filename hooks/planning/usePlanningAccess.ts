// hooks/planning/usePlanningAccess.ts

"use client";

import { useEffect, useState } from "react";
import { listFolders } from "@/services/planning/folderService";

export function usePlanningAccess(projectId: number) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    (async () => {
      try {
        await listFolders(projectId);
        if (!cancelled) {
          setEnabled(true);
        }
      } catch (err: any) {
        if (cancelled) return;

        if (err?.status === 403) {
          setEnabled(false);
        } else {
          setError(err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { enabled, error };
}
