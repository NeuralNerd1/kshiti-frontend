"use client";

import { useRouter, useParams } from "next/navigation";
import AdminPage from "@/components/company/admin/AdminPage";

export default function AdminHomePage() {
  const router = useRouter();
  const { company } = useParams<{ company: string }>();

  return (
    <AdminPage
      breadcrumbs={[
        { label: "Dashboard", href: `/company/${company}/dashboard` },
        { label: "Admin Console" },
      ]}
      title="Administration"
      subtitle="Manage users, roles, and access for this company"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button
          className="btnSecondary"
          onClick={() =>
            router.push(`/company/${company}/admin/users`)
          }
        >
          Manage Users
        </button>

        <button
          className="btnSecondary"
          onClick={() =>
            router.push(`/company/${company}/admin/roles`)
          }
        >
          Roles & Permissions
        </button>

        <button
          className="btnSecondary"
          onClick={() =>
            router.push(`/company/${company}/admin/company_details`)
          }
        >
          Company Details
        </button>
      </div>
    </AdminPage>
  );
}
