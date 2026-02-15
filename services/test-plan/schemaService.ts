import { apiRequest } from "@/services/apiClient";

/* ==========================================
   TYPES
   ========================================== */

export type SchemaField = {
    id?: number;
    field_key: string;
    display_name: string;
    field_type: string;
    source: "system" | "default_template" | "custom";
    editable?: boolean;
    is_required?: boolean;
    order?: number;
    field_options?: Record<string, unknown> | null;
};

export type EntitySchema = {
    entity: {
        id: number;
        display_name: string;
        level_order: number;
    };
    system_fields: SchemaField[];
    default_template_fields: SchemaField[];
    custom_fields: SchemaField[];
};

/* ==========================================
   API
   ========================================== */

const BASE = "/test-plan";

export function getEntitySchema(
    projectId: number,
    entityTypeId: number
): Promise<EntitySchema> {
    return apiRequest<EntitySchema>(
        `${BASE}/projects/${projectId}/entity-types/${entityTypeId}/schema/`
    );
}
