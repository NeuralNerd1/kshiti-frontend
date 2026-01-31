"use client";

import "./toast.css";
import type { ToastItem } from "./types";


export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: string) => void;
}) {
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-message">
        {toast.message}
      </span>

      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
      >
        ✕
      </button>
    </div>
  );
}
