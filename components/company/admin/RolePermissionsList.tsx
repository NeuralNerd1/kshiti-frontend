"use client";

export default function RolePermissionsList({
  permissions,
}: {
  permissions: Record<string, boolean>;
}) {
  const enabled = Object.entries(permissions).filter(
    ([_, value]) => value
  );

  const disabled = Object.entries(permissions).filter(
    ([_, value]) => !value
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      {/* ✅ ENABLED */}
      <PermissionColumn
        title="Enabled permissions"
        color="#22C55E"
        icon="✓"
        items={enabled}
      />

      {/* ❌ DISABLED */}
      <PermissionColumn
        title="Disabled permissions"
        color="#9CA3AF"
        icon="✕"
        items={disabled}
      />
    </div>
  );
}

function PermissionColumn({
  title,
  items,
  color,
  icon,
}: {
  title: string;
  items: [string, boolean][];
  color: string;
  icon: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 8,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            fontSize: 13,
            color: "#6B7280",
            fontStyle: "italic",
          }}
        >
          None
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {items.map(([key]) => (
            <li
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color,
              }}
            >
              <span>{icon}</span>
              <span>{key}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
