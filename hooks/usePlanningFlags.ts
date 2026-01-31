import { useEffect, useState } from "react";
import api from "@/services/planning/api";

export function usePlanningFlags(projectId: number) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/projects/${projectId}`)
      .then((res) => {
        if (!cancelled) {
          setEnabled(Boolean(res.data.flows_enabled));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load planning flags")
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { enabled, error };
}
