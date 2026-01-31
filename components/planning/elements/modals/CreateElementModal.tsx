"use client";

import { useState } from "react";
import { createElement } from "@/services/planning/elements/elementService";
import { SELECTOR_TYPES } from "@/types/selectorTypes";
import DownloadExtensionModal from "./DownloadExtensionModal";

export default function CreateElementModal({
  folderId,
  onClose,
  onCreated,
}: any) {
  const [name, setName] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  const [locators, setLocators] = useState([
    { selector_type: "css", selector_value: "" },
    { selector_type: "xpath", selector_value: "" },
    { selector_type: "id", selector_value: "" },
  ]);

  const [showExtensionHelp, setShowExtensionHelp] =
    useState(false);

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card element-modal">
          <h2>Create element</h2>

          {/* ELEMENT NAME */}
          <div className="form-group">
            <label>Element name</label>
            <input
              className="modal-input"
              placeholder="e.g. Login Button"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          {/* PAGE URL */}
          <div className="form-group">
            <label>Page URL</label>
            <input
              className="modal-input"
              placeholder="https://example.com/login"
              value={pageUrl}
              onChange={(e) =>
                setPageUrl(e.target.value)
              }
            />
          </div>

          {/* LOCATORS */}
          <div className="locator-section">
            <label>Locators</label>

            {locators.map((l, i) => (
              <div
                key={i}
                className="locator-row"
              >
                <select
                  className="modal-input locator-type"
                  value={l.selector_type}
                  onChange={(e) => {
                    const copy = [...locators];
                    copy[i].selector_type =
                      e.target.value;
                    setLocators(copy);
                  }}
                >
                  {SELECTOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <input
                  className="modal-input locator-value"
                  placeholder="Selector value"
                  value={l.selector_value}
                  onChange={(e) => {
                    const copy = [...locators];
                    copy[i].selector_value =
                      e.target.value;
                    setLocators(copy);
                  }}
                />
              </div>
            ))}

            <button
              className="add-locator-btn"
              onClick={() =>
                setLocators((prev) => [
                  ...prev,
                  {
                    selector_type: "css",
                    selector_value: "",
                  },
                ])
              }
            >
              + Add locator
            </button>
          </div>

          {/* CAPTURE */}
          <div className="capture-helper">
            <button
              className="create-flow-btn"
              onClick={() =>
                setShowExtensionHelp(true)
              }
            >
              Capture element (via extension)
            </button>

            <p>
              Auto-capture requires browser
              extension
            </p>
          </div>

          {/* ACTIONS */}
          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn-primary"
              onClick={async () => {
                const el = await createElement({
                  folder_id: folderId,
                  name,
                  page_url: pageUrl,
                  locators,
                });

                onCreated(el);
                onClose();
              }}
            >
              Save element
            </button>
          </div>
        </div>
      </div>

      {showExtensionHelp && (
        <DownloadExtensionModal
          onClose={() =>
            setShowExtensionHelp(false)
          }
        />
      )}
    </>
  );
}
