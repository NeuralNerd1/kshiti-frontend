import api from "@/services/api";

/* ======================================================
   TYPES
====================================================== */

export type TestCase = {
  id: number;
  name: string;
  description?: string;
  status: "SAVED" | "ARCHIVED";
  current_version: number;
  folder: number;
  created_at: string;
  updated_at: string;
};

export type TestCaseVersion = {
  version_number: number;
  pre_conditions_json: any[];
  steps_json: any[];
  expected_outcomes_json: any[];
  created_from_version: number | null;
  created_at: string;
};

export type TestCaseDetailResponse = {
  test_case: TestCase;
  folder: {
    id: number;
    name: string;
    path: string;
    parent: number | null;
  };
  versions: TestCaseVersion[];
};

/* ======================================================
   TEST CASE SERVICES
====================================================== */

/**
 * Create test case
 */
export async function createTestCase(payload: {
  folder_id: number;
  name: string;
  description?: string;
}) {
  const { data } = await api.post(
    "/planning/test-cases/",
    payload
  );

  return data as TestCase;
}

/**
 * List test cases
 */
export async function listTestCases(
  projectId: number
) {
  const { data } = await api.get(
    `/planning/test-cases/list/?project_id=${projectId}`
  );

  return data as TestCase[];
}

/**
 * Get test case detail + versions
 */
export async function getTestCaseDetail(
  testCaseId: number
) {
  const { data } = await api.get(
    `/planning/test-cases/${testCaseId}/`
  );

  return data as TestCaseDetailResponse;
}

/**
 * Archive test case
 */
export async function archiveTestCase(
  testCaseId: number
) {
  const { data } = await api.post(
    `/planning/test-cases/${testCaseId}/archive/`
  );

  return data;
}

/**
 * Save builder section
 */
export async function saveTestCaseSection(
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
    `/planning/test-cases/${testCaseId}/builder/save/`,
    payload
  );

  return data;
}

/**
 * Import flow into test case
 */
export async function importFlowToTestCase(
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
    `/planning/test-cases/${testCaseId}/import-flow/`,
    payload
  );

  return data;
}

export async function updateTestCase(
  id: number,
  data: {
    name: string;
    description?: string;
  }
) {
  const res = await api.put(
    `/planning/test-cases/${id}`,
    data
  );

  return res.data;
}