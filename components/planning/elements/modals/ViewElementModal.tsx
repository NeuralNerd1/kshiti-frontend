"use client";

export default function ViewElementModal({
  element,
  onClose,
}: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-card element-modal">
        <h2>{element.name}</h2>

        {element.page_url && (
          <p className="element-url">
            {element.page_url}
          </p>
        )}

        <div className="locator-section">
          {element.locators.map(
            (l: any, i: number) => (
              <div
                key={i}
                className="locator-row"
              >
                <span className="element-locator-chip">
                  {l.selector_type}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  {l.selector_value}
                </span>
              </div>
            )
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
