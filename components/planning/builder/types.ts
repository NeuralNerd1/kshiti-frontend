export type ActionParameter = {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "select";
  required?: boolean;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type ActionDefinition = {
  action_key: string;
  action_name: string;
  description?: string;

  // ✅ this must match backend
  parameter_schema?: ParameterSchema;
};

export type StepHook = {
  type: "manual_check";
  note?: string;
};
export type ExecutionNotes = {
  before?: string[];
  after?: string[];
  on_error?: string[];
};

export type FlowStep = {
  step_id: string;
  action_key: string;
  parameters: Record<string, string>;
  execution_notes?: ExecutionNotes;
  meta?: {
    label?: string;
    disabled?: boolean;
    hooks?: StepHook[];
  };
};

export type ParameterSchemaField = {
  type: "string" | "number" | "boolean";
  required?: boolean;
};

export type ParameterSchema = {
  required?: Record<string, ParameterSchemaField>;
  optional?: Record<string, ParameterSchemaField>;
};
export type RegistryAction = ActionDefinition;

export type ActionCategory = {
  name: string;
  actions: ActionDefinition[];
};
