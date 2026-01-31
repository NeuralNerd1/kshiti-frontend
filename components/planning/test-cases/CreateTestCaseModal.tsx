"use client";

import { useState } from "react";
import { createTestCase } from "@/services/planning/testCaseService";

export default function CreateTestCaseModal({
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
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const created = await createTestCase({
        name,
        description,
        folder_id: folderId,
      });

      onSuccess(created);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Create Test Case</h2>

        <input
          className="modal-input"
          placeholder="Test case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="modal-textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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
