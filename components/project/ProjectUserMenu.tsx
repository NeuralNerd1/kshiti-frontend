"use client";

import { useSession } from "@/hooks/useSession";
import { useState } from "react";

export default function ProjectUserMenu() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 10px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          cursor: "pointer",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          {user.email[0].toUpperCase()}
        </div>
        <span style={{ fontSize: 14 }}>{user.email}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 48,
            width: 220,
            borderRadius: 14,
            background: "#020617",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 8,
          }}
        >
          {["Profile", "Project Console", "Test Console"].map(
            (item) => (
              <div
                key={item}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {item}
              </div>
            )
          )}

          
        </div>
      )}
    </div>
  );
}
