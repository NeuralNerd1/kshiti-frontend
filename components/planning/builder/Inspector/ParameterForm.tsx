"use client";

import { ParameterSchema } from "../types";

type Props = {
  parameters: Record<string, any>;
  schema: ParameterSchema | null;
  onChange: (params: Record<string, any>) => void;
  readOnly?: boolean;
};

export default function ParameterForm({
  parameters,
  schema,
  onChange,
  readOnly = false,
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
    const block = readOnly
      ? { disabled: true }
      : {};

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

    // ✅ DEFAULT STRING
    return (
      <input
        className="formInput"
        value={value}
        disabled={readOnly}
        onChange={(e) => {
          if (readOnly) return;
          onChange({
            ...parameters,
            [key]: e.target.value,
          });
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
