"use client";

import { useState, useRef, useEffect } from "react";
import TestCaseActionsMenu from "./TestCaseActionsMenu";

type TestCaseCardProps = {
  testCase: {
    id: number;
    name: string;
    description?: string;
    status: "SAVED" | "ARCHIVED";
  };
  onOpen: () => void;
  onEdit: () => void;
  onArchive: () => void;
  canEdit: boolean;
};

export default function TestCaseCard({
  testCase,
  onOpen,
  onEdit,
  onArchive,
  canEdit,
}: TestCaseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () =>
      document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div
      className={`flow-card ${menuOpen ? "menu-open" : ""}`}
      onClick={onOpen}
    >
      {/* ================= HEADER ================= */}
      <div className="flow-card-header">
        <div
          className="flow-card-title-block"
          title={testCase.name}
        >
          <div className="flow-name">
            {testCase.name}
          </div>

          {testCase.description && (
            <div
              className="flow-description"
              title={testCase.description}
            >
              {testCase.description}
            </div>
          )}
        </div>

        {canEdit && (
          <div
            ref={wrapperRef}
            className="flow-actions-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flow-kebab"
              onClick={() =>
                setMenuOpen((v) => !v)
              }
            >
              ⋮
            </button>

            {menuOpen && (
              <TestCaseActionsMenu
                onEdit={() => {
                  onEdit();
                  setMenuOpen(false);
                }}
                onArchive={() => {
                  onArchive();
                  setMenuOpen(false);
                }}
                onClose={() =>
                  setMenuOpen(false)
                }
              />
            )}
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flow-card-footer">
        <span
          className={`flow-status-chip ${
            testCase.status === "ARCHIVED"
              ? "archived"
              : "active"
          }`}
        >
          {testCase.status}
        </span>
      </div>
    </div>
  );
}
