"use client";

import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function DashboardPage() {
  const session = useAuthRedirect({ requireAuth: true });

  if (session.loading) return <Loader label="Loading dashboard…" />;

  if (!session.authenticated) {
    return (
      <ErrorState
        title="Access denied"
        description="You are not authenticated."
      />
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.email}</p>
    </div>
  );
}
