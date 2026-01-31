"use client";

export default function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #1F2937",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ background: "#020617" }}>
          <tr>
            {columns.map((c) => (
              <th key={c} style={th}>
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "14px 20px",
  fontSize: 13,
  color: "#9CA3AF",
  fontWeight: 500,
  textAlign: "left" as const,
};

