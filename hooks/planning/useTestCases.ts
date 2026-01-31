"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/hooks/projects/useProject";
import {
  listTestCases,
  TestCase,
} from "@/services/planning/testCaseService";

export function useTestCases(
  projectId: number | null,
  folderId?: number
) {
  const { project } = useProject();

  const [testCases, setTestCases] =
    useState<TestCase[]>([]);
  const [loading, setLoading] =
    useState<boolean>(true);

  const canCreate =
    project?.permissions?.can_create_test_cases === true;

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    listTestCases(projectId)
      .then((data) => {
        if (cancelled) return;

        const filtered = folderId
          ? data.filter(
              (tc) => tc.folder === folderId
            )
          : data;

        setTestCases(filtered);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, folderId]);

  return {
    testCases,
    loading,
    canCreate,
    setTestCases,
  };
}
