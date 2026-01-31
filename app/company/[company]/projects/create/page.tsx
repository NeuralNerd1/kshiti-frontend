"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { useProjects } from "@/hooks/useProjects";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { logout } from "@/services/authService";

import HeaderShell from "@/components/layout/HeaderShell/HeaderShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import SectionCard from "@/components/layout/SectionCard";
import ProjectCreateForm from "@/components/company/projects/ProjectCreateForm";

export default function CreateProjectPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  // 🔐 Session & company
  const session = useSession();
  const companyName = useCompanyName(company);

  // 📦 Data
  const { createProject } = useProjects();
  const { users } = useAdminUsers();

  // ⏳ UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // 🔓 Logout
  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    router.replace(`/company/${company}/login`);
  }

  // ⛔ Guard AFTER hooks
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
      {/* ==============================
          PAGE CONTENT CONTAINER
      ============================== */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          paddingTop: 24,
        }}
      >
        {/* ===== Breadcrumbs ===== */}
        <Breadcrumbs
          items={[
            {
              label: "Projects",
              href: `/company/${company}/projects`,
            },
            {
              label: "Create Project",
            },
          ]}
        />

        {/* ===== Page Header ===== */}
        <div style={{ marginTop: 12 }}>
          <PageHeader
            title="Create Project"
            subtitle=" "
          />
        </div>

        {/* ===== Form Card ===== */}
        <div
  style={{
    marginTop: 40,
    padding: 24,
  }}
>
  <SectionCard>
    <ProjectCreateForm
      users={users.map((u) => ({
        id: u.id,
        email: u.email,
      }))}
      loading={loading}
      error={error}
      onSubmit={async (payload) => {
        setLoading(true);
        setError(undefined);

        try {
          await createProject(payload);
          router.push(`/company/${company}/projects`);
        } catch (err: any) {
          setError(
            err?.message || "Failed to create project"
          );
        } finally {
          setLoading(false);
        }
      }}
    />
  </SectionCard>
</div>
      </div>
    </HeaderShell>
  );
}
