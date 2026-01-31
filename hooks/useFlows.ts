import { useEffect, useState } from "react";
import {
  FlowSummary,
  listFlows,
} from "@/services/planning/planningFlowService";

export function useFlows(projectId: number) {
  const [flows, setFlows] = useState<FlowSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    listFlows(projectId)
      .then((data) => {
        if (!cancelled) setFlows(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load flows")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { flows, loading, error };
}
