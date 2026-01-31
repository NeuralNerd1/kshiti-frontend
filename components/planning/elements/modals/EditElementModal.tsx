"use client";

import { useState } from "react";
import { updateElement } from "@/services/planning/elements/elementService";

const SELECTOR_TYPES = [
  "css",
  "xpath",
  "id",
  "name",
  "class",
  "tag",
  "text",
  "role",
  "testid",
  "label",
  "placeholder",
  "alt",
  "title",
  "nth",
  "visible",
  "has_text",
  "has",
  "frame",
];

export default function EditElementModal({
  element,
  onClose,
  onSaved,
}: any) {
  const [name, setName] = useState(element.name || "");
  const [pageUrl, setPageUrl] = useState(
    element.page_url || ""
  );

  const [originalLocators] = useState(
  element.locators || []
);


  const [locators, setLocators] = useState(
    element.locators?.map((l: any) => ({
      selector_type: l.selector_type,
      selector_value: l.selector_value,
      is_active: l.is_active ?? true,
    })) || []
  );

  const addLocator = () => {
    setLocators((prev: any[]) => [
      ...prev,
      {
        selector_type: "css",
        selector_value: "",
        is_active: true,
      },
    ]);
  };

  const updateLocator = (
    index: number,
    key: string,
    value: string
  ) => {
    const copy = [...locators];
    copy[index] = {
      ...copy[index],
      [key]: value,
    };
    setLocators(copy);
  };

  const save = async () => {
    await updateElement(element.id, {
  name,
  page_url: pageUrl,
  locators,
  originalLocators,
});

    onSaved();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card element-modal">
        <h2>Edit element</h2>

        {/* ELEMENT DETAILS */}
        <div className="form-group">
          <label>Element name</label>
          <input
            className="modal-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Page URL</label>
          <input
            className="modal-input"
            value={pageUrl}
            onChange={(e) =>
              setPageUrl(e.target.value)
            }
            placeholder="https://example.com/page"
          />
        </div>

        {/* LOCATORS */}
        <div className="locator-section">
          <label>Locators</label>

          {locators.map((loc: any, i: number) => (
            <div
              key={i}
              className="locator-row"
            >
              <select
                className="modal-input locator-type"
                value={loc.selector_type}
                onChange={(e) =>
                  updateLocator(
                    i,
                    "selector_type",
                    e.target.value
                  )
                }
              >
                {SELECTOR_TYPES.map((t) => (
                  <option
                    key={t}
                    value={t}
                  >
                    {t}
                  </option>
                ))}
              </select>

              <input
                className="modal-input locator-value"
                value={loc.selector_value}
                onChange={(e) =>
                  updateLocator(
                    i,
                    "selector_value",
                    e.target.value
                  )
                }
                placeholder="Enter selector value"
              />
            </div>
          ))}

          <button
            className="add-locator-btn"
            onClick={addLocator}
          >
            + Add more
          </button>
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
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
