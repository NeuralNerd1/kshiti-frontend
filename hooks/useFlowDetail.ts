import { useEffect, useState } from "react";
import {
  FlowDetail,
  getFlow,
} from "@/services/planning/planningFlowService";

export function useFlowDetail(
  flowId: number,
  version?: number
) {
  const [flow, setFlow] = useState<FlowDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    getFlow(flowId, version)
      .then((data) => {
        if (!cancelled) setFlow(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load flow")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [flowId, version]);

  return { flow, loading, error };
}
