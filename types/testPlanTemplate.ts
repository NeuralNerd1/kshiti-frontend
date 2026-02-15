export type TestPlanTemplate = {
    id: number;
    name: string;
    description?: string;
    status: "DRAFT" | "CURRENT";
    created_at?: string;
    updated_at?: string;
};
