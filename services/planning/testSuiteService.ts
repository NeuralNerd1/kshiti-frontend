import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type TestSuite = {
    id: number;
    name: string;
    description?: string;
    tags: string[];
    test_case_ids: number[];
    status: "ACTIVE" | "ARCHIVED";
    created_at: string;
    updated_at: string;
};

/* ======================================================
   TEST SUITE SERVICES
====================================================== */

/**
 * Create test suite (scoped to current user via bearer token)
 */
export async function createTestSuite(payload: {
    project_id: number;
    name: string;
    description?: string;
    tags?: string[];
    test_case_ids?: number[];
}) {
    const { data } = await api.post(
        "/planning/test-suites/",
        payload
    );

    return data as TestSuite;
}

/**
 * List test suites (scoped to current user via bearer token)
 */
export async function listTestSuites(
    projectId: number
) {
    const { data } = await api.get(
        `/planning/test-suites/list/?project_id=${projectId}`
    );

    return data as TestSuite[];
}

/**
 * Get test suite detail
 */
export async function getTestSuiteDetail(
    suiteId: number
) {
    const { data } = await api.get(
        `/planning/test-suites/${suiteId}/`
    );

    return data as TestSuite;
}

/**
 * Update test suite
 */
export async function updateTestSuite(
    suiteId: number,
    payload: {
        name?: string;
        description?: string;
        tags?: string[];
        test_case_ids?: number[];
    }
) {
    const { data } = await api.put(
        `/planning/test-suites/${suiteId}/`,
        payload
    );

    return data as TestSuite;
}

/**
 * Delete test suite
 */
export async function deleteTestSuite(
    suiteId: number
) {
    await api.delete(
        `/planning/test-suites/${suiteId}/`
    );
}
