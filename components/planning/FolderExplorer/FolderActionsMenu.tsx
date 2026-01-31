"use client";

import { useState } from "react";

type Props = {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export default function FlowsActionsMenu({
  onEdit,
  onArchive,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flow-actions-wrapper"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="flow-kebab"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>

      {open && (
        <div
          className="flow-actions-menu"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            Edit
          </button>

          <button
            onClick={() => {
              onArchive();
              setOpen(false);
            }}
          >
            Archive
          </button>

          <button
            className="danger"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
