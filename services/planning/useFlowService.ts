// services/useFlowService.ts

import api from "./api";

export const FlowService = {
  getFlowDetail(flowId: number) {
    return api.get(`/flows/${flowId}/`);
  },

  getRegistry() {
    return api.get(`/planning/registry/`);
  },

  saveVersion(flowId: number, payload: {
    steps_json: any[];
    created_from_version?: number;
  }) {
    return api.post(`/flows/${flowId}/versions/`, payload);
  },

  rollback(flowId: number, version: number) {
    return api.post(`/flows/${flowId}/versions/${version}/rollback/`);
  }
};
