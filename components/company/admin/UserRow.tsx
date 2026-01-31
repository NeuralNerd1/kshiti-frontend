type User = {
  email: string;
  role_id: number;
  is_active: boolean;
};

export default function UserRow({ user }: { user: User }) {
  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.role_id}</td>
      <td>{user.is_active ? "Active" : "Inactive"}</td>
    </tr>
  );
}
