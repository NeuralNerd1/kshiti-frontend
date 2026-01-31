"use client";

export default function ViewVariableModal({
  variable,
  onClose,
}: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-card element-modal">
        <h2>Variable Details</h2>

        <div className="form-group">
          <label>Key</label>
          <input
            className="modal-input"
            value={variable.key}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Value</label>
          <input
            className="modal-input"
            value={variable.value}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            className="modal-input"
            value={
              variable.description || "-"
            }
            disabled
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
