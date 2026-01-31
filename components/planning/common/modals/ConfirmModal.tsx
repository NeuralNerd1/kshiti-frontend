"use client";

interface Props {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "Confirm action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{title}</h2>

        <p
          style={{
            fontSize: 14,
            color: "#94a3b8",
          }}
        >
          {message}
        </p>

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={
              danger
                ? "btn-danger"
                : "btn-primary"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
