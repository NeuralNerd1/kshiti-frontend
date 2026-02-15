"use client";

import { useState } from "react";
import type { ProcessTemplate } from "@/types/testPlan";

type TemplateCardProps = {
    template: ProcessTemplate;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Draft", cls: "draft" },
    SUBMITTED: { label: "Submitted", cls: "submitted" },
    APPROVAL_PENDING: { label: "Pending", cls: "pending" },
    APPROVED: { label: "Approved", cls: "approved" },
    CREATED: { label: "Created", cls: "created" },
    REJECTED: { label: "Rejected", cls: "rejected" },
    ACTIVATED: { label: "Activated", cls: "activated" },
};

export default function TemplateCard({
    template,
    onClick,
    onEdit,
    onDelete,
}: TemplateCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const status = STATUS_MAP[template.status] ?? { label: template.status, cls: "draft" };

    return (
        <div
            className={`template-card ${menuOpen ? "menu-open" : ""}`}
            onClick={onClick}
        >
            {/* HEADER */}
            <div className="template-card-header">
                <div className="template-card-title-block">
                    <span className="template-name">{template.name}</span>
                    {template.description && (
                        <span className="template-description">
                            {template.description}
                        </span>
                    )}
                </div>

                {/* KEBAB MENU */}
                <div className="template-actions-wrapper">
                    <button
                        className="template-kebab"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                    >
                        ⋮
                    </button>

                    {menuOpen && (
                        <div className="template-actions-menu">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onEdit();
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onDelete();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="template-card-footer">
                <span className={`template-status-chip ${status.cls}`}>
                    {status.label}
                </span>
            </div>
        </div>
    );
}
