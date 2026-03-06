"use client";

import { useState } from "react";
import { createLocalTestCase } from "@/services/planning/localTestCaseService";
import TagsInput from "@/components/common/TagsInput";

export default function CreateLocalTestCaseModal({
    folderId,
    onClose,
    onSuccess,
}: {
    folderId: number;
    onClose: () => void;
    onSuccess: (testCase: any) => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);

            const created = await createLocalTestCase({
                name,
                description,
                folder_id: folderId,
                tags,
            });

            onSuccess(created);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Create Local Test Case</h2>

                <input
                    className="modal-input"
                    placeholder="Test case name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && name.trim()) handleCreate();
                    }}
                />

                <textarea
                    className="modal-textarea"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Tags */}
                <div className="modal-field-group">
                    <label className="modal-field-label">
                        Tags
                    </label>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        placeholder="Add tag and press Enter…"
                    />
                </div>

                <div className="modal-actions">
                    <button
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn-primary"
                        disabled={!name.trim() || loading}
                        onClick={handleCreate}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
