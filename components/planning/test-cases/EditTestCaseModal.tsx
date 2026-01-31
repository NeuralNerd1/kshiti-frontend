"use client";

import { useState } from "react";

export default function EditTestCaseModal({
  testCase,
  onClose,
  onSave,
}: {
  testCase: {
    id: number;
    name: string;
    description?: string;
  };
  onClose: () => void;
  onSave: (data: {
    name: string;
    description?: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(testCase.name);
  const [description, setDescription] =
    useState(testCase.description ?? "");

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Edit Test Case</h2>

        <input
          className="modal-input"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <textarea
          className="modal-textarea"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              onSave({ name, description })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
