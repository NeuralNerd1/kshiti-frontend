"use client";

import { useRef } from "react";
import { ParameterSchema } from "../types";
import VariableElementPicker from "./VariableElementPicker";

type Props = {
  parameters: Record<string, any>;
  schema: ParameterSchema | null;
  onChange: (params: Record<string, any>) => void;
  readOnly?: boolean;
  /** Pass projectId to enable the variable/element picker on string inputs */
  projectId?: number;
};

export default function ParameterForm({
  parameters,
  schema,
  onChange,
  readOnly = false,
  projectId,
}: Props) {
  if (!schema) return null;

  const requiredFields = Object.entries(schema.required ?? {});
  const optionalFields = Object.entries(schema.optional ?? {});

  const renderInput = (key: string, field: any) => {
    const value = parameters[key] ?? "";

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

    // 🔒 READ ONLY HELPERS
    const block = readOnly ? { disabled: true } : {};

    // ✅ selector_type dropdown
    if (key === "selector_type") {
      return (
        <select
          className="formSelect"
          value={value}
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange({
              ...parameters,
              [key]: e.target.value,
            });
          }}
        >
          <option value="">Select selector type</option>
          {SELECTOR_TYPES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    // ✅ ENUM
    if (Array.isArray(field.allowed)) {
      return (
        <select
          className="formSelect"
          value={value}
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange({
              ...parameters,
              [key]: e.target.value,
            });
          }}
        >
          <option value="">Select {key}</option>
          {field.allowed.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    // ✅ BOOLEAN
    if (field.type === "boolean") {
      return (
        <input
          type="checkbox"
          checked={!!value}
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange({
              ...parameters,
              [key]: e.target.checked,
            });
          }}
        />
      );
    }

    // ✅ NUMBER
    if (field.type === "number") {
      return (
        <input
          type="number"
          className="formInput"
          value={value}
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange({
              ...parameters,
              [key]: Number(e.target.value),
            });
          }}
        />
      );
    }

    // ✅ OBJECT
    if (field.type === "object") {
      return (
        <textarea
          className="formTextarea"
          placeholder="Enter JSON"
          value={
            typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : value
          }
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;

            try {
              const parsed = JSON.parse(e.target.value);
              onChange({
                ...parameters,
                [key]: parsed,
              });
            } catch {
              onChange({
                ...parameters,
                [key]: e.target.value,
              });
            }
          }}
        />
      );
    }

    // ✅ ARRAY
    if (field.type === "array") {
      return (
        <textarea
          className="formTextarea"
          placeholder="Comma separated or JSON array"
          value={
            Array.isArray(value)
              ? value.join(", ")
              : value
          }
          disabled={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange({
              ...parameters,
              [key]: e.target.value
                .split(",")
                .map((v) => v.trim()),
            });
          }}
        />
      );
    }

    // ✅ DEFAULT STRING — with variable/element picker
    return (
      <StringField
        fieldKey={key}
        value={value}
        readOnly={readOnly}
        projectId={projectId}
        onChange={(newVal) => {
          if (readOnly) return;
          onChange({ ...parameters, [key]: newVal });
        }}
      />
    );
  };

  return (
    <div className="builder-params">
      {/* REQUIRED */}
      {requiredFields.length > 0 && (
        <>
          {requiredFields.map(([key, field]) => (
            <div key={key} className="formGroup">
              <label className="formLabel">
                {key} *
              </label>
              {renderInput(key, field)}
            </div>
          ))}
        </>
      )}

      {/* OPTIONAL */}
      {optionalFields.length > 0 && (
        <>
          <div className="text-xs text-gray-400 mt-2">
            Optional
          </div>

          {optionalFields.map(([key, field]) => (
            <div key={key} className="formGroup">
              <label className="formLabel">
                {key}
              </label>
              {renderInput(key, field)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ===================================================
   String field with variable/element picker button
=================================================== */
function StringField({
  fieldKey,
  value,
  readOnly,
  projectId,
  onChange,
}: {
  fieldKey: string;
  value: string;
  readOnly: boolean;
  projectId?: number;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  /** Insert text at current cursor position */
  const insertAtCursor = (text: string) => {
    const el = inputRef.current;
    if (!el) {
      onChange(value + text);
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const newVal =
      value.slice(0, start) + text + value.slice(end);
    onChange(newVal);

    // Restore focus + move cursor
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="param-string-row">
      <input
        ref={inputRef}
        className="formInput param-string-input"
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />

      {!readOnly && projectId != null && (
        <VariableElementPicker
          projectId={projectId}
          onInsert={insertAtCursor}
        />
      )}
    </div>
  );
}
