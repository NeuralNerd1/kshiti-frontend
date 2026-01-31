"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminRoles } from "@/hooks/useAdminRoles";


import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { logout } from "@/services/authService";
import { useAdminUsers } from "@/hooks/useAdminUsers";

import HeaderShell from "@/components/layout/HeaderShell/HeaderShell";
import AdminPage from "@/components/company/admin/AdminPage";
import DataTableActions from "@/components/common/datatable/DataTableActions";
import AdminUsersTable from "@/components/company/admin/AdminUsersTable";
import ErrorState from "@/components/layout/ErrorState";
import EmptyState from "@/components/layout/EmptyState";

export default function AdminUsersPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  /* =============================
     GLOBAL CONTEXT (FOR HEADER)
  ============================== */
  const session = useSession();
  const companyName = useCompanyName(company);
  const { roles } = useAdminRoles();


  /* =============================
     DATA
  ============================== */
  const { users, loading, error, refresh } = useAdminUsers();

  /* =============================
     UI STATE
  ============================== */
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<"all" | "active" | "inactive">("all");

  const [columns, setColumns] = useState({
    email: true,
    role: true,
    status: true,
  });

  /* =============================
     FILTERED DATA
  ============================== */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.email
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "all" ||
        (status === "active" && u.is_active) ||
        (status === "inactive" && !u.is_active);

      return matchSearch && matchStatus;
    });
  }, [users, search, status]);


  const roleMap = useMemo(() => {
  const map: Record<number, string> = {};
  roles?.forEach((role) => {
    map[role.id] = role.name;
  });
  return map;
}, [roles]);

  /* =============================
     LOGOUT
  ============================== */
  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    router.replace(`/company/${company}/login`);
  }

  /* =============================
     GUARD
  ============================== */
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
        router.push(`/company/${company}/dashboard`)
      }
      onGoProfile={() =>
        router.push(`/company/${company}/profile`)
      }
      onResetPassword={() =>
        router.push(`/company/${company}/reset-password`)
      }
      onLogout={handleLogout}
    >
      {/* ⬇️ NO EXTRA WRAPPER, NO PADDING, NO MARGIN */}
      <AdminPage
        breadcrumbs={[
          {
            label: "Administration",
            href: `/company/${company}/admin`,
          },
          { label: "Users" },
        ]}
        title="Company Users"
        subtitle="Manage users who have access to this company"
      >
        {/* =============================
            LOADING / ERROR / EMPTY
        ============================== */}
        {loading && (
          <p className="text-sm text-gray-400">
            Loading users…
          </p>
        )}

        {error && (
          <ErrorState
            message={error.message}
            retry={refresh}
          />
        )}

        {!loading && !error && users.length === 0 && (
          <EmptyState
            title="No users found"
            description="No users are currently associated with this company."
          />
        )}

        {/* =============================
            ACTIONS + TABLE
        ============================== */}
        {!loading && !error && users.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <DataTableActions
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={(v) => {
  if (v === "all" || v === "active" || v === "inactive") {
    setStatus(v);
  }
}}
                columns={columns}
                onToggleColumn={(key) =>
                  setColumns((c) => ({
                    ...c,
                    [key]:
                      !c[key as keyof typeof c],
                  }))
                }
              />
            </div>

            <AdminUsersTable
              users={filteredUsers}
              visibleColumns={columns}
              roleMap={roleMap}
            />
          </>
        )}
      </AdminPage>
    </HeaderShell>
  );
}
