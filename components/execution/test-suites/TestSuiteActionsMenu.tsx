"use client";

import { useEffect, useRef } from "react";

export default function TestSuiteActionsMenu({
    onEdit,
    onDelete,
    onClose,
}: {
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handler);
        return () =>
            document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div ref={ref} className="flow-actions-menu">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
            >
                Edit
            </button>

            <button
                className="danger"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                Delete
            </button>
        </div>
    );
}
