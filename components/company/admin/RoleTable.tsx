import RolePermissionList from "./RolePermissionList";

type Role = {
  id: number;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions_json: Record<string, boolean>;
};

export default function RoleTable({ roles }: { roles: Role[] }) {
  return (
    <div className="card-body">
      {roles.map((role) => (
        <div key={role.id} style={{ marginBottom: 24 }}>
          <h2>{role.name}</h2>
          <p>{role.description}</p>

          <RolePermissionList
            permissions={role.permissions_json}
            readOnly={role.is_system_role}
          />
        </div>
      ))}
    </div>
  );
}
