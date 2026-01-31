"use client";

import { useEffect, useState } from "react";
import { Flow } from "@/types/planning";
import { getFlows } from "@/services/planning/flowService";

export function useFlows(
  projectId: number | null,
  folderId?: number
) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(true);

  useEffect(() => {
    // ⛔ No project yet → do nothing
    if (!projectId) return;

    let cancelled = false;
    setLoading(true);

    const pid = projectId;

async function load() {
  try {
    const data = await getFlows(pid, folderId);
        if (!cancelled) setFlows(data);
      } catch (e: any) {
        if (e?.status === 403 && !cancelled) {
          setFlows([]);
          setCanCreate(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId, folderId]);

  return {
    flows,
    loading,
    canCreate,
    setFlows,
  };
}
