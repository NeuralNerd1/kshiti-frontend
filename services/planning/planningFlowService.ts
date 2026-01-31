import { AxiosResponse } from "axios";
import api from "./api";

/* ================= TYPES ================= */

export type FlowStatus = "DRAFT" | "SAVED" | "ARCHIVED";

export type FlowSummary = {
  id: number;
  name: string;
  description: string;
  current_version: number;
  status: FlowStatus;
  folder_id: number | null;
  updated_at: string;
};

export type FlowStep = {
  step_id: string;
  action_key: string;
  step_name: string;
  step_description: string;
  execution_notes: string;
  parameters: Record<string, unknown>;
};

export type FlowVersion = {
  version_number: number;
  steps_json: FlowStep[];
  created_from_version: number | null;
  created_at: string;
};

export type FlowDetail = {
  id: number;
  name: string;
  description: string;
  status: FlowStatus;
  current_version: number;
  version: FlowVersion;
};

/* ================= API ================= */

export async function listFlows(
  projectId: number
): Promise<FlowSummary[]> {
  const res: AxiosResponse<FlowSummary[]> =
    await api.get(`/projects/${projectId}/planning/flows`);
  return res.data;
}

export async function createFlow(
  projectId: number,
  payload: {
    name: string;
    description?: string;
    folder_id?: number | null;
  }
): Promise<FlowDetail> {
  const res: AxiosResponse<FlowDetail> =
    await api.post(`/projects/${projectId}/planning/flows`, payload);
  return res.data;
}

export async function getFlow(
  flowId: number,
  version?: number
): Promise<FlowDetail> {
  const url = version
    ? `/planning/flows/${flowId}?version=${version}`
    : `/planning/flows/${flowId}`;

  const res: AxiosResponse<FlowDetail> = await api.get(url);
  return res.data;
}

export async function saveFlowVersion(
  flowId: number,
  steps: FlowStep[]
): Promise<FlowDetail> {
  const res: AxiosResponse<FlowDetail> =
    await api.post(`/planning/flows/${flowId}/versions`, { steps });
  return res.data;
}
