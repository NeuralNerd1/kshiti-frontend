"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCompanyProjects,
  createCompanyProject,
} from "@/services/projectService";

type ApiError = {
  message: string;
  status: number;
};

type Project = {
  id: number;
  name: string;
  description?: string;
  max_team_members: number;
  created_at: string;
};

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Public refresh API (used by pages / retry buttons)
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCompanyProjects();
      setProjects(data);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err);
      } else {
        setError({
          message: "Unexpected error",
          status: 500,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — effect owns async logic
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCompanyProjects();
        if (!cancelled) {
          setProjects(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isApiError(err)) {
            setError(err);
          } else {
            setError({
              message: "Unexpected error",
              status: 500,
            });
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const createProject = async (payload: {
    name: string;
    description?: string;
    max_team_members: number;
    project_admin: number;
  }) => {
    return createCompanyProject(payload);
  };

  return {
    projects,
    loading,
    error,
    refresh,
    createProject,
  };
}
