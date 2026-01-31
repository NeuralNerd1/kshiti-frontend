"use client";

import DataTable from "@/components/common/datatable/DataTable";
import RolePermissionsList from "./RolePermissionsList";

type Role = {
  id: number;
  name: string;
  is_system_role: boolean;
  permissions_json: Record<string, boolean>;
};

export default function AdminRolesTable({
  roles,
}: {
  roles: Role[];
}) {
  return (
    <DataTable columns={["Role", "Type", "Permissions"]}>
      {roles.map((role) => (
        <tr
          key={role.id}
          style={{
            borderTop: "1px solid #1F2937",
            verticalAlign: "top",
          }}
        >
          {/* Role Name */}
          <td style={td}>
            <div style={{ fontWeight: 600 }}>
              {role.name}
            </div>
          </td>

          {/* Role Type */}
          <td style={td}>
            <span
              style={{
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 999,
                background: role.is_system_role
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(34,197,94,0.15)",
                color: role.is_system_role
                  ? "#A5B4FC"
                  : "#22C55E",
              }}
            >
              {role.is_system_role
                ? "System"
                : "Company"}
            </span>
          </td>

          {/* Permissions */}
          <td style={td}>
            <RolePermissionsList
              permissions={role.permissions_json}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

const td = {
  padding: "16px 20px",
  fontSize: 14,
  color: "#E5E7EB",
};
