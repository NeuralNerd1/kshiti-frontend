"use client";

export type StatusFilterValue = string;

export type StatusFilterOption = {
  label: string;
  value: StatusFilterValue;
};

const defaultOptions: StatusFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function StatusFilter({
  value,
  onChange,
  options = defaultOptions,
}: {
  value: StatusFilterValue;
  onChange: (v: StatusFilterValue) => void;
  options?: StatusFilterOption[];
}) {
  const current =
    options.find((o) => o.value === value)?.label ??
    options[0]?.label;

  return (
    <details style={{ position: "relative" }}>
      <summary
        className="btnSecondary"
        style={{
          minWidth: 120,
          listStyle: "none",
          cursor: "pointer",
        }}
      >
        {current}
      </summary>

      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          right: 0,
          background: "#020617",
          border: "1px solid #1F2937",
          borderRadius: 12,
          padding: 6,
          minWidth: 160,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 8,
              background:
                opt.value === value
                  ? "rgba(99,102,241,0.15)"
                  : "transparent",
              color:
                opt.value === value
                  ? "#A5B4FC"
                  : "#E5E7EB",
              fontSize: 13,
              border: "none",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </details>
  );
}
