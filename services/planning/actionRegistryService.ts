import { AxiosResponse } from "axios";
import api from "./api";

export type ActionParameterSchema = {
  type: string;
};

export type ActionDefinition = {
  action_key: string;
  action_name: string;
  action_group: string;
  schema: {
    required: Record<string, ActionParameterSchema>;
    optional: Record<string, ActionParameterSchema>;
  };
};

export async function listActions(): Promise<ActionDefinition[]> {
  const res: AxiosResponse<ActionDefinition[]> =
    await api.get("/planning/action-registry");
  return res.data;
}
