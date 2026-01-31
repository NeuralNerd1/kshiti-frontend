"use client";

import { useEffect, useRef } from "react";

type Props = {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function FlowActionsMenu({
  onEdit,
  onArchive,
  onDelete,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="flow-actions-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onEdit}>Edit</button>

      <button onClick={onArchive}>Archive</button>

      <button className="danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
