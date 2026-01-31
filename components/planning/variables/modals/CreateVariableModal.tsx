"use client";

import { useState } from "react";
import { createVariable } from "@/services/planning/variables/variableService";

interface Props {
  folderId: number;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateVariableModal({
  folderId,
  onClose,
  onCreated,
}: Props) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] =
    useState("");

  const handleCreate = async () => {
    await createVariable({
      folder_id: folderId,
      key,
      value,
      description,
    });

    onCreated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card element-modal">
        <h2>Create Variable</h2>

        <div className="form-group">
          <label>Key</label>
          <input
            className="modal-input"
            value={key}
            onChange={(e) =>
              setKey(e.target.value)
            }
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
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
