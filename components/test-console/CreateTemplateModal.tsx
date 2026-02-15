"use client";

import { useState } from "react";

export default function CreateTemplateModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (data: {
        name: string;
        description?: string;
    }) => Promise<void>;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!name.trim()) return;

        setLoading(true);
        await onCreate({
            name,
            description: description || undefined,
        });
        setLoading(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Create Test Plan Template</h2>

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
                        {loading ? "Saving…" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
