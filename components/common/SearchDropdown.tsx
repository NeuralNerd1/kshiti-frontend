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
    <div style={{ display: "grid", gap: "12px" }}>
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
        }}
      />

      {showResults && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: "12px", color: "#6b7280" }}>
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
                  borderBottom: "1px solid #f3f4f6",
                }}
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
