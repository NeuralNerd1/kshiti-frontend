"use client";

import { useState } from "react";

export function FolderModal({
  type,
  defaultValue = "",
  onClose,
  onConfirm,
}: {
  type: "create" | "rename" | "delete";
  defaultValue?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {type !== "delete" && (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Folder name"
            autoFocus
          />
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>

          <button
            className="primary"
            onClick={() => onConfirm(value)}
          >
            {type === "delete" ? "Delete" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
