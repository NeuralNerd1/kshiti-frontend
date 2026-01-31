"use client";

export default function DownloadExtensionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card extension-modal">
        <h2>Capture elements automatically</h2>

        <p>
          To capture elements visually, install
          the Automation Capture Extension.
        </p>

        <ul>
          <li>✔ Works on any website</li>
          <li>✔ Auto generates selectors</li>
          <li>✔ Syncs with your project</li>
        </ul>

        <a
          href="#"
          className="btn-primary"
          style={{ textAlign: "center" }}
        >
          Download extension
        </a>

        <button
          className="btn-secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
