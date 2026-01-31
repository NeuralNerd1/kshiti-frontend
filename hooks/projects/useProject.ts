"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getProject } from "@/services/projectService";

type ProjectState = {
  project: any | null;
  loading: boolean;
  error: string | null;
};

export function useProject(): ProjectState {
  const params = useParams<{ project?: string }>();
  const projectId = params?.project as string | undefined;


  const [state, setState] = useState<ProjectState>({
    project: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // ⛔ wait until projectId is available
    if (!projectId) {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      return;
    }

    const pid = projectId;

    let cancelled = false;

    async function fetchProject() {
    try {
      const data = await getProject(pid);

        if (cancelled) return;

        setState({
          project: data,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (cancelled) return;

        setState({
          project: null,
          loading: false,
          error:
            err?.message ||
            err?.response?.data?.message ||
            "Failed to load project",
        });
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return state;
}
