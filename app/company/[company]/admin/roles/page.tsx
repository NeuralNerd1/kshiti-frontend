"use client";

import { useParams } from "next/navigation";

import HeaderShell from "@/components/layout/HeaderShell/HeaderShell";
import AdminPage from "@/components/company/admin/AdminPage";
import AdminRolesTable from "@/components/company/admin/AdminRolesTable";
import ErrorState from "@/components/layout/ErrorState";
import EmptyState from "@/components/layout/EmptyState";

import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { useAdminRoles } from "@/hooks/useAdminRoles";
import { logout } from "@/services/authService";

export default function AdminRolesPage() {
  const { company } = useParams<{ company: string }>();

  const session = useSession();
  const companyName = useCompanyName(company);
  const { roles, loading, error } = useAdminRoles();

  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    location.href = `/company/${company}/login`;
  }

  if (
    session.loading ||
    !session.authenticated ||
    !companyName
  ) {
    return null;
  }

  return (
    <HeaderShell
      userName={session.user.email}
      companyName={companyName}
      onGoHome={() =>
        (location.href = `/company/${company}/dashboard`)
      }
      onGoProfile={() =>
        (location.href = `/company/${company}/profile`)
      }
      onResetPassword={() =>
        (location.href = `/company/${company}/reset-password`)
      }
      onLogout={handleLogout}
    >
      <AdminPage
        breadcrumbs={[
          {
            label: "Administration",
            href: `/company/${company}/admin`,
          },
          { label: "Roles & Permissions" },
        ]}
        title="Roles & Permissions"
        subtitle="System and company roles (read-only)"
      >
        {loading && (
          <p className="text-sm text-gray-400">
            Loading roles…
          </p>
        )}

        {error && (
          <ErrorState message={error.message} />
        )}

        {!loading && !error && roles.length === 0 && (
          <EmptyState
            title="No roles available"
            description="No roles were returned by the system."
          />
        )}

        {!loading && !error && roles.length > 0 && (
          <AdminRolesTable roles={roles} />
        )}
      </AdminPage>
    </HeaderShell>
  );
}
