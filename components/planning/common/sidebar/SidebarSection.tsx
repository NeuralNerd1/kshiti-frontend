// components/project/sidebar/SidebarSection.tsx

"use client";

import { ReactNode, useState } from "react";

type SidebarSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function SidebarSection({
  title,
  defaultOpen = false,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          all: "unset",
          cursor: "pointer",
          padding: "8px 12px",
          fontSize: 13,
          fontWeight: 600,
          color: "#9CA3AF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 12 }}>{open ? "▾" : "▸"}</span>
      </button>

      {/* Section Content */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingLeft: 8,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
