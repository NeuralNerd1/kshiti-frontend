"use client";

import "./confirmationModal.css";

type Props = {
  open: boolean;

  title?: string;
  message?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  open,
  title = "Unsaved changes",
  message = "You have unsaved changes. Are you sure you want to continue?",
  confirmText = "Reload anyway",
  cancelText = "Wait",

  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-card">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirmation-actions">
          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
