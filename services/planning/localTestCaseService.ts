import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type LocalTestCase = {
    id: number;
    name: string;
    description?: string;
    status: "SAVED" | "ARCHIVED";
    current_version: number;
    folder: number;
    tags: string[];
    created_at: string;
    updated_at: string;
};

export type LocalTestCaseVersion = {
    version_number: number;
    pre_conditions_json: any[];
    steps_json: any[];
    expected_outcomes_json: any[];
    created_from_version: number | null;
    created_at: string;
};

export type LocalTestCaseDetailResponse = {
    test_case: LocalTestCase;
    folder: {
        id: number;
        name: string;
        path: string;
        parent: number | null;
    };
    versions: LocalTestCaseVersion[];
};

/* ======================================================
   LOCAL TEST CASE SERVICES
====================================================== */

/**
 * Create local test case
 */
export async function createLocalTestCase(payload: {
    folder_id: number;
    name: string;
    description?: string;
    tags?: string[];
}) {
    const { data } = await api.post(
        "/planning/local-test-cases/",
        payload
    );

    return data as LocalTestCase;
}

/**
 * List local test cases (scoped to current user via bearer token)
 */
export async function listLocalTestCases(
    projectId: number
) {
    const { data } = await api.get(
        `/planning/local-test-cases/list/?project_id=${projectId}`
    );

    return data as LocalTestCase[];
}

/**
 * Get local test case detail + versions
 */
export async function getLocalTestCaseDetail(
    testCaseId: number
) {
    const { data } = await api.get(
        `/planning/local-test-cases/${testCaseId}/`
    );

    return data as LocalTestCaseDetailResponse;
}

/**
 * Archive local test case
 */
export async function archiveLocalTestCase(
    testCaseId: number
) {
    const { data } = await api.post(
        `/planning/local-test-cases/${testCaseId}/archive/`
    );

    return data;
}

/**
 * Save builder section
 */
export async function saveLocalTestCaseSection(
    testCaseId: number,
    payload: {
        section:
        | "pre_conditions"
        | "steps"
        | "expected_outcomes";
        steps: any[];
    }
) {
    const { data } = await api.post(
        `/planning/local-test-cases/${testCaseId}/builder/save/`,
        payload
    );

    return data;
}

/**
 * Import flow into local test case
 */
export async function importFlowToLocalTestCase(
    testCaseId: number,
    payload: {
        flow_id: number;
        target_section:
        | "pre_conditions"
        | "steps"
        | "expected_outcomes";
    }
) {
    const { data } = await api.post(
        `/planning/local-test-cases/${testCaseId}/import-flow/`,
        payload
    );

    return data;
}

export async function updateLocalTestCase(
    id: number,
    data: {
        name: string;
        description?: string;
    }
) {
    const res = await api.put(
        `/planning/local-test-cases/${id}/`,
        data
    );

    return res.data;
}
