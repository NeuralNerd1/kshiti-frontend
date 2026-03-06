"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/hooks/projects/useProject";
import {
    listTestSuites,
    TestSuite,
} from "@/services/planning/testSuiteService";

export function useTestSuites(
    projectId: number | null
) {
    const { project } = useProject();

    const [testSuites, setTestSuites] =
        useState<TestSuite[]>([]);
    const [loading, setLoading] =
        useState<boolean>(true);

    useEffect(() => {
        if (!projectId) return;

        let cancelled = false;

        listTestSuites(projectId)
            .then((data) => {
                if (cancelled) return;
                setTestSuites(data);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [projectId]);

    return {
        testSuites,
        loading,
        setTestSuites,
    };
}
