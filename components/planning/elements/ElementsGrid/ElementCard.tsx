"use client";

import { useState } from "react";

export default function ElementCard({
  element,
  onEdit,
  onDelete,
  onOpen,
}: any) {
  const [menuOpen, setMenuOpen] = useState(false);

  const active =
    element.locators?.find(
      (l: any) => l.is_active
    ) || element.locators?.[0];

  return (
    <div
      className={`flow-card ${
        menuOpen ? "menu-open" : ""
      }`}
      onClick={onOpen}
    >
      <div className="flow-card-header">
        <div className="flow-card-title-block">
          <div className="flow-name">
            {element.name}
          </div>

          {element.page_url && (
            <div className="flow-description">
              {element.page_url}
            </div>
          )}
        </div>

        <div className="flow-actions-wrapper">
          <button
            className="flow-kebab"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            ⋮
          </button>
        </div>
      </div>

      <div className="flow-card-footer">
        {active && (
          <span className="flow-status-chip draft">
            {active.selector_type}
          </span>
        )}
      </div>

      {menuOpen && (
        <div
          className="flow-actions-menu"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <button onClick={onOpen}>
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
  );
}
