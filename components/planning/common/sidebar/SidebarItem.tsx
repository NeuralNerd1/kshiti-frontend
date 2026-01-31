// components/project/sidebar/SidebarItem.tsx

"use client";

type SidebarItemProps = {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
};

export default function SidebarItem({
  label,
  href,
  active = false,
  disabled = false,
}: SidebarItemProps) {
  const content = (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled
          ? "#6B7280"
          : active
          ? "#A5B4FC"
          : "#E5E7EB",
        background: active
          ? "rgba(99,102,241,0.15)"
          : "transparent",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </div>
  );

  if (disabled || !href) {
    return content;
  }

  return (
    <a href={href} style={{ textDecoration: "none" }}>
      {content}
    </a>
  );
}
