import api from "@/services/api";
import { LocalTestCase } from "./localTestCaseService";
import { TestSuite } from "./testSuiteService";

/* ======================================================
   BRIDGE API SERVICES
   
   All bridge endpoints are automatically scoped to the
   current user via the bearer token sent by the API
   interceptor in api.ts.
   
   Responses include tags for both local and global entries.
====================================================== */

/**
 * List bridge local test cases (visible only to creator)
 */
export async function listBridgeLocalTestCases(
    projectId: number
) {
    const { data } = await api.get(
        `/planning/bridge/local-test-cases/?project_id=${projectId}`
    );

    return data as LocalTestCase[];
}

/**
 * List bridge test suites (visible only to creator)
 */
export async function listBridgeTestSuites(
    projectId: number
) {
    const { data } = await api.get(
        `/planning/bridge/test-suites/?project_id=${projectId}`
    );

    return data as TestSuite[];
}
