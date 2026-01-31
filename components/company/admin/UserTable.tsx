import UserRow from "./UserRow";

type User = {
  id: number;
  email: string;
  role_id: number;
  is_active: boolean;
};

export default function UserTable({ users }: { users: User[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  );
}
