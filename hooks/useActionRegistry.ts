import { useEffect, useState } from "react";
import {
  ActionDefinition,
  listActions,
} from "@/services/planning/actionRegistryService";

export function useActionRegistry() {
  const [actions, setActions] = useState<ActionDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    listActions()
      .then((data) => {
        if (!cancelled) setActions(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load action registry")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { actions, loading, error };
}
