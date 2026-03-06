"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/hooks/projects/useProject";
import {
    listLocalTestCases,
    LocalTestCase,
} from "@/services/planning/localTestCaseService";

export function useLocalTestCases(
    projectId: number | null,
    folderId?: number
) {
    const { project } = useProject();

    const [testCases, setTestCases] =
        useState<LocalTestCase[]>([]);
    const [loading, setLoading] =
        useState<boolean>(true);

    // Local test cases are always editable by the creator
    const canCreate = true;

    useEffect(() => {
        if (!projectId) return;

        let cancelled = false;

        listLocalTestCases(projectId)
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
