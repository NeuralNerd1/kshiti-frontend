"use client";

import { useState, useRef, useEffect } from "react";
import TestSuiteActionsMenu from "./TestSuiteActionsMenu";

type TestSuiteCardProps = {
    suite: {
        id: number;
        name: string;
        description?: string;
        status: "ACTIVE" | "ARCHIVED";
        tags?: string[];
        test_case_ids?: number[];
    };
    onOpen: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function TestSuiteCard({
    suite,
    onOpen,
    onEdit,
    onDelete,
}: TestSuiteCardProps) {
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

    const caseCount = suite.test_case_ids?.length ?? 0;

    return (
        <div
            className={`flow-card ${menuOpen ? "menu-open" : ""}`}
            onClick={onOpen}
        >
            {/* ================= HEADER ================= */}
            <div className="flow-card-header">
                <div
                    className="flow-card-title-block"
                    title={suite.name}
                >
                    <div className="flow-name">
                        {suite.name}
                    </div>

                    {suite.description && (
                        <div
                            className="flow-description"
                            title={suite.description}
                        >
                            {suite.description}
                        </div>
                    )}
                </div>

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
                        <TestSuiteActionsMenu
                            onEdit={() => {
                                onEdit();
                                setMenuOpen(false);
                            }}
                            onDelete={() => {
                                onDelete();
                                setMenuOpen(false);
                            }}
                            onClose={() =>
                                setMenuOpen(false)
                            }
                        />
                    )}
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="flow-card-footer">
                {/* Case count */}
                <span className="suite-case-count">
                    {caseCount} test case{caseCount !== 1 ? "s" : ""}
                </span>

                <span
                    className={`flow-status-chip ${suite.status === "ARCHIVED"
                        ? "archived"
                        : "active"
                        }`}
                >
                    {suite.status}
                </span>

                {/* Tags */}
                {suite.tags && suite.tags.length > 0 && (
                    <div className="tc-tags-row">
                        {suite.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="tc-tag-chip">
                                {tag}
                            </span>
                        ))}
                        {suite.tags.length > 4 && (
                            <span className="tc-tag-chip tc-tag-more">
                                +{suite.tags.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
