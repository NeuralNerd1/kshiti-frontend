"use client";

export default function ColumnSelector({
  columns,
  onToggle,
}: {
  columns: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <details>
      <summary className="btnSecondary" style={{ cursor: "pointer" }}>
        Columns
      </summary>

      <div
        style={{
          position: "absolute",
          background: "#020617",
          border: "1px solid #1F2937",
          borderRadius: 12,
          padding: 12,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 10,
        }}
      >
        {Object.entries(columns).map(([key, visible]) => (
          <label
            key={key}
            style={{
              display: "flex",
              gap: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visible}
              onChange={() => onToggle(key)}
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
    </details>
  );
}
