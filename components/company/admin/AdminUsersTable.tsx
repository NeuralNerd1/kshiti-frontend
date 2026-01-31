"use client";

import DataTable from "@/components/common/datatable/DataTable";

type User = {
  id: number;
  email: string;
  role_id: number;
  is_active: boolean;
};

export default function AdminUsersTable({
  users,
  visibleColumns,
  roleMap,
}: {
  users: User[];
  visibleColumns: {
    email: boolean;
    role: boolean;
    status: boolean;
  };
  roleMap: Record<number, string>;
}) {
  const columns = [
    visibleColumns.email && "Email",
    visibleColumns.role && "Role",
    visibleColumns.status && "Status",
  ].filter(Boolean) as string[];

  return (
    <DataTable columns={columns}>
      {users.map((u) => (
        <tr
  key={u.id}
  style={{
    borderTop: "1px solid #1F2937",
    height: 56, // ⬅ consistent row height
  }}
>
          {visibleColumns.email && (
            <td style={td}>{u.email}</td>
          )}
          {visibleColumns.role && (
            <td style={td}>
  {roleMap[u.role_id] ?? "—"}
</td>
          )}
          {visibleColumns.status && (
            <td
  style={{
    ...td,
    display: "flex",
    alignItems: "center",
  }}
>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 12,
      lineHeight: "1",
      background: u.is_active
        ? "rgba(34,197,94,0.15)"
        : "rgba(248,113,113,0.15)",
      color: u.is_active ? "#22C55E" : "#F87171",
    }}
  >
    {u.is_active ? "Active" : "Inactive"}
  </span>
</td>

          )}
        </tr>
      ))}
    </DataTable>
  );
}

const td = {
  padding: "16px 20px", // ⬅ matches header
  fontSize: 14,
  color: "#E5E7EB",
};

