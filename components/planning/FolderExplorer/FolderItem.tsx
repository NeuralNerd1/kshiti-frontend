"use client";

import { useState } from "react";

type Props = {
  id: number;
  name: string;
  level: number;
  activeId: string;
  onSelect: (id: string) => void;
  canEditFlows: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (
    action: "create" | "rename" | "delete",
    id: number
  ) => void;
};

export function FolderItem({
  id,
  name,
  level,
  activeId,
  onSelect,
  canEditFlows,
  hasChildren,
  isExpanded,
  onToggle,
  onAction,
}: Props) {
  const isActive = activeId === String(id);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`folder-item ${isActive ? "active" : ""}`}
      style={{ paddingLeft: `${20 + level * 16}px` }}
      onClick={() => onSelect(String(id))}
    >
      {/* TRIANGLE */}
      <span
        className={`folder-caret ${
          hasChildren ? "" : "disabled"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) onToggle();
        }}
      >
        {isExpanded ? "▾" : "▸"}
      </span>

      {/* NAME */}
      <span className="folder-name">{name}</span>

      {/* ACTIONS */}
      {canEditFlows && (
        <div
          className="folder-kebab-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="folder-kebab"
            onClick={() => setOpen((v) => !v)}
          >
            ⋮
          </button>

          {open && (
            <div
              className="folder-actions-menu"
              onMouseLeave={() => setOpen(false)}
            >
              <button
                onClick={() => {
                  onAction("create", id);
                  setOpen(false);
                }}
              >
                New subfolder
              </button>

              <button
                onClick={() => {
                  onAction("rename", id);
                  setOpen(false);
                }}
              >
                Rename
              </button>

              <button
                className="danger"
                onClick={() => {
                  onAction("delete", id);
                  setOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
