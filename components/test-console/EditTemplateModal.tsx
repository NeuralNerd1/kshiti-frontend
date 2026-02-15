"use client";

import { useState } from "react";
import type { ProcessTemplate } from "@/types/testPlan";

type TestPlanTemplate = ProcessTemplate;

export default function EditTemplateModal({
    template,
    onClose,
    onSave,
}: {
    template: TestPlanTemplate;
    onClose: () => void;
    onSave: (data: {
        name: string;
        description?: string;
    }) => Promise<void>;
}) {
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(
        template.description || ""
    );
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!name.trim()) return;

        setLoading(true);
        await onSave({
            name,
            description: description || undefined,
        });
        setLoading(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Edit Template</h2>

                <div className="formGroup">
                    <label className="formLabel">Name</label>
                    <input
                        className="formInput"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Template name"
                    />
                </div>

                <div className="formGroup">
                    <label className="formLabel">Description</label>
                    <textarea
                        className="formTextarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional description"
                    />
                </div>

                <div className="formActions">
                    <button
                        className="btnSecondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btnPrimary"
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
