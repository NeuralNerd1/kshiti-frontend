"use client";
import { Flow } from "@/types/planning";

export default function FlowsList({
  flows,
  onOpen,
}: {
  flows: Flow[];
  onOpen: (id: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
      }}
    >
      {flows.map((flow) => (
        <div
          key={flow.id}
          onClick={() => onOpen(flow.id)}
          style={{
            padding: 20,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 600 }}>{flow.name}</div>
          <div
            style={{
              fontSize: 13,
              color: "#94A3B8",
              marginTop: 6,
            }}
          >
            {flow.description || "No description"}
          </div>
        </div>
      ))}
    </div>
  );
}
