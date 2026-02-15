"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ProcessTemplate } from "@/types/testPlan";
import { listPendingReviews } from "@/services/test-plan/templateService";

import "@/styles/test-console/reviewBell.css";

type Props = {
    projectId: number;
    onReview: (template: ProcessTemplate) => void;
};

export default function ReviewNotificationBell({ projectId, onReview }: Props) {
    const [pending, setPending] = useState<ProcessTemplate[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const load = useCallback(() => {
        listPendingReviews(projectId)
            .then(setPending)
            .catch(() => setPending([]));
    }, [projectId]);

    useEffect(() => {
        load();
        const interval = setInterval(load, 30_000); // refresh every 30s
        return () => clearInterval(interval);
    }, [load]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const count = pending.length;

    return (
        <div className="review-bell-wrapper" ref={ref}>
            <button
                className="review-bell-btn"
                onClick={() => setOpen(!open)}
                title="Pending reviews"
            >
                <svg
                    className="review-bell-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {count > 0 && (
                    <span className="review-bell-badge">{count}</span>
                )}
            </button>

            {open && (
                <div className="review-bell-dropdown">
                    <div className="review-bell-dropdown-header">
                        Pending Reviews
                    </div>
                    {count === 0 ? (
                        <div className="review-bell-empty">
                            No pending reviews
                        </div>
                    ) : (
                        <div className="review-bell-list">
                            {pending.map((t) => (
                                <button
                                    key={t.id}
                                    className="review-bell-item"
                                    onClick={() => {
                                        setOpen(false);
                                        onReview(t);
                                    }}
                                >
                                    <div className="review-bell-item-name">
                                        {t.name}
                                    </div>
                                    <div className="review-bell-item-meta">
                                        v{t.version_number} · {new Date(t.updated_at).toLocaleDateString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
