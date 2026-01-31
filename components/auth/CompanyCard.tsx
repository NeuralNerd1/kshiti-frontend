"use client";

import React from "react";

type CompanyCardProps = {
  name: string;
  slug: string;
  onClick: (slug: string) => void;
};

export default function CompanyCard({
  name,
  slug,
  onClick,
}: CompanyCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(slug)}
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        textAlign: "left",
        cursor: "pointer",
      }}
      aria-label={`Select company ${name}`}
    >
      <span
        style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#111827",
        }}
      >
        {name}
      </span>
    </button>
  );
}
