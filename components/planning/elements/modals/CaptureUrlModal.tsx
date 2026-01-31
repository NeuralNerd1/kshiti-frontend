"use client";

import { useState } from "react";
import CaptureBrowserModal from "./CaptureBrowserModal";

export default function CaptureUrlModal({
  onClose,
  onCaptured,
}: any) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <CaptureBrowserModal
        url={url}
        onCancel={onClose}
        onCaptured={onCaptured}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Enter page URL</h2>

        <input
          className="modal-input"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
        />

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() => setOpen(true)}
          >
            Open browser
          </button>
        </div>
      </div>
    </div>
  );
}
