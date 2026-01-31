"use client";

import { useState } from "react";

interface Props {
  variable: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VariableCard({
  variable,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <div
      className={`flow-card ${
        menuOpen ? "menu-open" : ""
      }`}
      onClick={onView}
    >
      {/* HEADER */}
      <div className="flow-card-header">
        <div className="flow-card-title-block">
          <div className="flow-name">
            {variable.key}
          </div>

          <div className="flow-description">
            {variable.value}
          </div>
        </div>

        <div className="flow-actions-wrapper">
          <button
            className="flow-kebab"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            ⋮
          </button>

          {menuOpen && (
            <div
              className="flow-actions-menu"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button onClick={onView}>
                View
              </button>

              <button onClick={onEdit}>
                Edit
              </button>

              <button
                className="danger"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flow-card-footer">
        <span className="flow-status-chip draft">
          VARIABLE
        </span>
      </div>
    </div>
  );
}
