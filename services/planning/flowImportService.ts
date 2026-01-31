import api from "@/services/api";

export async function getFlowFolders(projectId: number) {
  return api.get(
    `/planning/projects/${projectId}/folders/`
  );
}

export async function getFlows(projectId: number) {
  return api.get(
    `/planning/projects/${projectId}/flows/`
  );
}

export async function importFlowToTestCase(
  testCaseId: number,
  flowId: number,
  section: string
) {
  return api.post(
    `/planning/test-cases/${testCaseId}/import-flow/`,
    {
      flow_id: flowId,
      target_section: section,
    }
  );
}
