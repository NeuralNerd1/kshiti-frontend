"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ErrorState from "@/components/layout/ErrorState";
import ProjectList from "@/components/company/projects/ProjectList";
import ProjectEmptyState from "@/components/company/projects/ProjectEmptyState";

import { useProjects } from "@/hooks/useProjects";
import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { getCompanyUsers } from "@/services/userService";
import { logout } from "@/services/authService";

// 🧱 Layout
import AppShell from "@/components/layout/AppShell/AppShell";

export default function ProjectsPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  // 🔐 Session
  const session = useSession();
  const companyName = useCompanyName(company);

  // 🧪 Admin probe
  const [isAdmin, setIsAdmin] = useState(false);

  // 📦 Projects data (UNCHANGED)
  const { projects, loading, error } = useProjects();

  // 🔐 Redirect unauthenticated users
  useEffect(() => {
    if (!session.loading && !session.authenticated) {
      router.replace(`/company/${company}/login`);
    }
  }, [session.loading, session.authenticated, company, router]);

  // 🧪 Admin permission probe (NON-BLOCKING)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await getCompanyUsers();
        if (!cancelled) setIsAdmin(true);
      } catch {
        // non-admin user
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    router.replace(`/company/${company}/login`);
  }

  // ⛔ Guard AFTER all hooks
  if (
    session.loading ||
    !session.authenticated ||
    !companyName
  ) {
    return null;
  }

  return (
    <AppShell
      userName={session.user.email}
      companyName={companyName}
      companySlug={company}
      showAdmin={isAdmin}
      onLogout={handleLogout}
      onGoProjects={() =>
        router.push(`/company/${company}/projects/`)
      }
      onGoAdmin={() =>
        router.push(`/company/${company}/admin`)
      }
      onResetPassword={() =>
        router.push(`/company/${company}/reset-password`)
      }
    >
      {/* ===== Projects Page Content ===== */}
      <div
        style={{
          maxWidth: 1200,
          padding: "24px 24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* 🔹 Proper header row (FIXED ALIGNMENT) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#F9FAFB",
              }}
            >
              Projects
            </h1>
            <p
              style={{
                marginTop: 4,
                fontSize: 14,
                color: "#9CA3AF",
                maxWidth: 560,
              }}
            >
              Create, manage, and track all projects within your organization
            </p>
          </div>

          <button
  onClick={() =>
    router.push(`/company/${company}/projects/create`)
  }
  className="btnPrimary"
>
  <span>＋</span>
  <span>Create Project</span>
</button>
        </div>

        {/* 🔹 States */}
        {loading && (
          <div className="text-sm text-gray-400">
            Loading projects…
          </div>
        )}

        {error && <ErrorState message={error.message} />}

        {!loading && !error && projects.length === 0 && (
          <ProjectEmptyState/>
        )}

        {!loading && !error && projects.length > 0 && (
          <ProjectList projects={projects} />
        )}
      </div>
    </AppShell>
  );
}
