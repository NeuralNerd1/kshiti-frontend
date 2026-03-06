"use client";

import { useState, useRef, useEffect } from "react";
import TestCaseActionsMenu from "./TestCaseActionsMenu";

type TestCaseCardProps = {
  testCase: {
    id: number;
    name: string;
    description?: string;
    status: "SAVED" | "ARCHIVED";
    tags?: string[];
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
          className={`flow-status-chip ${testCase.status === "ARCHIVED"
            ? "archived"
            : "active"
            }`}
        >
          {testCase.status}
        </span>

        {/* Tags */}
        {testCase.tags && testCase.tags.length > 0 && (
          <div className="tc-tags-row">
            {testCase.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tc-tag-chip">
                {tag}
              </span>
            ))}
            {testCase.tags.length > 4 && (
              <span className="tc-tag-chip tc-tag-more">
                +{testCase.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
