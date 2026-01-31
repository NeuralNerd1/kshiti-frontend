"use client";

import { useState, useRef, useEffect } from "react";
import FlowActionsMenu from "./FlowActionsMenu";
import {
  deleteFlow,
  archiveFlow,
} from "@/services/planning/flowService";

type FlowCardProps = {
  id: number;
  name: string;
  description?: string;

  // ✅ already coming from backend
  status: "draft" | "active" | "archived";

  onOpen: () => void;
  onEdit: (id: number) => void;
  onDeleted?: (id: number) => void;
  onArchived?: (id: number) => void;
};

export default function FlowCard({
  id,
  name,
  description,
  status,
  onOpen,
  onEdit,
  onDeleted,
  onArchived,
}: FlowCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [menuOpen]);

  return (
  <div
    className={`flow-card ${menuOpen ? "menu-open" : ""}`}
    onClick={onOpen}
  >
    {/* ================= HEADER ================= */}
    <div className="flow-card-header">
      {/* LEFT SIDE — TITLE + DESCRIPTION */}
      <div
        className="flow-card-title-block"
        title={name} // ✅ hover full title
      >
        <div className="flow-name">
          {name}
        </div>

        {description && (
          <div
            className="flow-description"
            title={description}
          >
            {description}
          </div>
        )}
      </div>

      {/* RIGHT SIDE — KEBAB */}
      <div
        ref={wrapperRef}
        className="flow-actions-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flow-kebab"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ⋮
        </button>

        {menuOpen && (
          <FlowActionsMenu
  onEdit={() => {
    onEdit(id);
    setMenuOpen(false);
  }}
  onArchive={async () => {
    await archiveFlow(id);
    onArchived?.(id);
    setMenuOpen(false);
  }}
  onDelete={async () => {
    await deleteFlow(id);
    onDeleted?.(id);
    setMenuOpen(false);
  }}
  onClose={() => setMenuOpen(false)}
/>
        )}
      </div>
    </div>

    {/* ================= FOOTER ================= */}
    <div className="flow-card-footer">
      <span className={`flow-status-chip ${status}`}>
        {status}
      </span>
    </div>
  </div>
);
}