"use client";

import TemplateCard from "./TemplateCard";
import type { ProcessTemplate } from "@/types/testPlan";

type TemplatesGridProps = {
    templates: ProcessTemplate[];
    loading: boolean;
    onClick: (template: ProcessTemplate) => void;
    onEdit: (template: ProcessTemplate) => void;
    onDelete: (templateId: number) => void;
};

export default function TemplatesGrid({
    templates,
    loading,
    onClick,
    onEdit,
    onDelete,
}: TemplatesGridProps) {
    if (loading) {
        return (
            <div className="templates-empty">
                Loading templates…
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="templates-empty">
                No test plan templates yet. Create one to get started.
            </div>
        );
    }

    return (
        <div className="templates-grid">
            {templates.map((template) => (
                <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => onClick(template)}
                    onEdit={() => onEdit(template)}
                    onDelete={() => onDelete(template.id)}
                />
            ))}
        </div>
    );
}
