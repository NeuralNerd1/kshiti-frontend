"use client";

import { useEffect, useRef } from "react";

export default function TestCaseActionsMenu({
  onEdit,
  onArchive,
  onClose,
}: {
  onEdit: () => void;
  onArchive: () => void;
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
    <div ref={ref} className="testcase-actions-menu">
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
        onClick={onArchive}
      >
        Archive
      </button>
    </div>
  );
}
