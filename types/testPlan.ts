/* =========================================================
   TEST PLAN — UNIFIED TYPES
   Matches backend serializers exactly.
   ========================================================= */

// ---- Template Status ----
export type TemplateStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVAL_PENDING"
    | "APPROVED"
    | "CREATED"
    | "REJECTED"
    | "ACTIVATED";

// ---- Process Template ----
export type ProcessTemplate = {
    id: number;
    name: string;
    description: string;
    version_number: number;
    status: TemplateStatus;
    is_locked: boolean;
    created_by: number | null;
    reviewer: number | null;
    rejection_note: string | null;
    created_at: string;
    updated_at: string;
};

export type CreateTemplatePayload = {
    name: string;
    description?: string;
};

// ---- Planning Entity Type ----
export type PlanningEntityType = {
    id: number;
    internal_key: string;
    display_name: string;
    level_order: number;
    allow_children: boolean;
    allow_execution_binding: boolean;
    allow_dependencies: boolean;
    allow_time_tracking: boolean;
};

export type CreateEntityTypePayload = {
    internal_key: string;
    display_name: string;
    level_order: number;
    allow_children: boolean;
    allow_execution_binding: boolean;
    allow_dependencies: boolean;
    allow_time_tracking: boolean;
};

// ---- Field Types ----
export type FieldType =
    | "text"
    | "long_text"
    | "number"
    | "date"
    | "datetime"
    | "select"
    | "multi_select"
    | "user"
    | "multi_user"
    | "boolean"
    | "json";

// ---- Entity Field Definition ----
export type EntityFieldDefinition = {
    id: number;
    field_key: string;
    display_name: string;
    field_type: FieldType;
    is_required: boolean;
    is_execution_field: boolean;
    is_editable: boolean;
    order: number;
    options_json: unknown | null;
    default_value_json: unknown | null;
};

export type CreateFieldPayload = {
    field_key: string;
    display_name: string;
    field_type: FieldType;
    is_required: boolean;
    is_execution_field?: boolean;
    is_editable?: boolean;
    order: number;
    options_json?: unknown;
    default_value_json?: unknown;
};

// ---- Workflow ----
export type WorkflowDefinition = {
    id: number;
    entity_type: number;
    initial_state: number | null;
};

export type WorkflowState = {
    id: number;
    name: string;
    is_final: boolean;
    order: number;
};

export type WorkflowTransition = {
    id: number;
    from_state: number;
    to_state: number;
    allowed_roles: string[];
};

export type WorkflowDetail = {
    workflow: WorkflowDefinition;
    states: WorkflowState[];
    transitions: WorkflowTransition[];
};

export type CreateStatePayload = {
    name: string;
    is_final?: boolean;
    order: number;
};

export type CreateTransitionPayload = {
    from_state: number;
    to_state: number;
    allowed_roles?: string[];
};

// ---- Bootstrap Summary ----
export type BootstrapSummary = {
    entities_created: number;
    fields_created: number;
    workflows_created: number;
    time_rules_created: number;
};

// ---- Project Planning Config ----
export type ProjectPlanningConfig = {
    entity_level_1_name: string;
    entity_level_2_name: string;
    entity_level_3_name: string;
    entity_level_4_name: string;
    entity_level_5_name: string;
};

// ---- Project Template Binding ----
export type ProjectTemplateBinding = {
    id: number;
    project: number;
    template: number;
    is_active: boolean;
    activated_by: number;
    activated_at: string;
};

// ---- Planning Item ----
export type PlanningItem = {
    id: number;
    project: number;
    entity_type: number;
    parent: number | null;
    path: string;
    status: number | null;
    owner: number | null;
    assigned_users: number[];
    start_date: string | null;
    end_date: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
};

export type CreatePlanningItemPayload = {
    entity_type: number;
    parent?: number | null;
    owner: number;
    assigned_users?: number[];
    start_date?: string;
    end_date?: string;
    field_values?: Record<string, unknown>;
};

// ---- Time Tracking ----
export type TimeTrackingRule = {
    id: number;
    entity_type: number;
    start_mode: "MANUAL" | "STATUS_CHANGE" | "EXECUTION_START";
    stop_mode: "MANUAL" | "STATUS_CHANGE" | "EXECUTION_END";
    allow_multiple_sessions: boolean;
};

export type TimeTrackingSession = {
    id: number;
    planning_item: number;
    user: number;
    started_at: string;
    ended_at: string | null;
    duration_seconds: number;
};

// ---- Dependency ----
export type PlanningDependency = {
    id: number;
    source_item: number;
    target_item: number;
    dependency_type: "BLOCKS" | "RELATES";
};
