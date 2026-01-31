"use client";

import { useState } from "react";
import { updateVariable } from "@/services/planning/variables/variableService";

export default function EditVariableModal({
  variable,
  onClose,
  onSaved,
}: any) {
  const [value, setValue] =
    useState(variable.value);

  const [description, setDescription] =
    useState(variable.description || "");

  const handleSave = async () => {
    await updateVariable(variable.id, {
      value,
      description,
    });

    onSaved();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card element-modal">
        <h2>Edit Variable</h2>

        <div className="form-group">
          <label>Key</label>
          <input
            className="modal-input"
            value={variable.key}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Value</label>
          <input
            className="modal-input"
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            className="modal-input"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
