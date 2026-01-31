"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { logout } from "@/services/authService";
import { useSession } from "@/hooks/useSession";
import { getCompanyUsers } from "@/services/userService";
import { useCompanyName } from "@/hooks/useCompanyName";

// 🧱 Layout
import AppShell from "@/components/layout/AppShell/AppShell";

// 📊 Dashboard UI
import DashboardHeader from "@/components/dashboard/Sections/DashboardHeader";
import StatsGrid from "@/components/dashboard/Stats/StatsGrid";
import LineChart from "@/components/dashboard/Charts/LineChart";
import BarChart from "@/components/dashboard/Charts/BarChart";

// 🧪 Mock data (temporary)
import {
  projectsTrend,
  testRunsTrend,
} from "@/components/dashboard/data/mockDashboardData";

export default function CompanyDashboardPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  // 🔐 Session
  const session = useSession();

  // 🏢 Company name (MUST be before any return)
  const companyName = useCompanyName(company);

  // 🛡️ Admin flag
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔐 Redirect logged-out users (UNCHANGED)
  useEffect(() => {
    if (!session.loading && !session.authenticated) {
      router.replace(`/company/${company}/login`);
    }
  }, [session.loading, session.authenticated, company, router]);

  // 🧪 Admin permission probe (UNCHANGED, NON-BLOCKING)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await getCompanyUsers();
        if (!cancelled) setIsAdmin(true);
      } catch {
        // silently ignore — user is not admin
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔓 Logout (UNCHANGED)
  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    router.replace(`/company/${company}/login`);
  }

  // ⛔ SINGLE SAFE GUARD (AFTER ALL HOOKS)
  if (
    session.loading ||
    !session.authenticated ||
    !companyName
  ) {
    return null;
  }

  // ✅ UI
  return (
    <AppShell
      userName={session.user.email}
      companyName={companyName}
      companySlug={company}
      showAdmin={isAdmin}
      onLogout={handleLogout}
      onGoProjects={() =>
        router.push(`/company/${company}/projects`)
      }
      onGoAdmin={() =>
        router.push(`/company/${company}/admin`)
      }
      onResetPassword={() =>
        router.push(`/company/${company}/reset-password`)
      }
    >
      <DashboardHeader />
      <StatsGrid />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 24,
        }}
      >
        <LineChart
          title="Projects Growth"
          data={projectsTrend}
        />
        <BarChart
          title="Test Runs This Week"
          data={testRunsTrend}
        />
      </div>
    </AppShell>
  );
}
