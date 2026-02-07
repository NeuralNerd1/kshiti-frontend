"use client";

import { useState } from "react";

type Item = {
  label: string;
  value: string;
};

type Props = {
  items: Item[];
  minChars?: number;
  placeholder?: string;
  onSelect: (value: string) => void;
  emptyText?: string;
};

export default function SearchDropdown({
  items,
  minChars = 2,
  placeholder = "Search…",
  onSelect,
  emptyText = "No results found",
}: Props) {
  const [query, setQuery] = useState("");

  const showResults = query.length >= minChars;

  const filtered = showResults
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Input */}
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        style={{
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #D1D5DB",
  background: "#FFFFFF",
  color: "#111827",        // dark text for visibility
  fontSize: "14px",
  outline: "none",
}}
      />

      {/* Dropdown */}
      {showResults && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            marginTop: "8px",
            background: "#1F2937", // matches .pageCard
            border: "1px solid #374151",
            borderRadius: "12px",
            maxHeight: "240px",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            zIndex: 50,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "12px",
                color: "#9CA3AF",
                fontSize: "14px",
              }}
            >
              {emptyText}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.value}
                onClick={() => onSelect(item.value)}
                style={{
                  padding: "12px",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
