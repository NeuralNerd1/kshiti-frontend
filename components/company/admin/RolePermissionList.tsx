export default function RolePermissionList({
  permissions,
  readOnly,
}: {
  permissions: Record<string, boolean>;
  readOnly: boolean;
}) {
  return (
    <div className="permission-list">
      {Object.entries(permissions).map(([key, value]) => (
        <div
          key={key}
          className={readOnly ? "permission-readonly" : ""}
        >
          {key}: {value ? "✔" : "✖"}
        </div>
      ))}
    </div>
  );
}
