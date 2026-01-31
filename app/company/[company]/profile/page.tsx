"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { getCompanyUsers } from "@/services/userService";
import { logout } from "@/services/authService";

import HeaderShell from "@/components/layout/HeaderShell/HeaderShell";

export default function ProfilePage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  const session = useSession();
  const companyName = useCompanyName(company);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await getCompanyUsers();
        if (!cancelled) setIsAdmin(true);
      } catch {
        // non-admin
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
      onGoProfile={() => {}}
      onResetPassword={() =>
        router.push(`/company/${company}/reset-password`)
      }
      onLogout={handleLogout}
    >
      {/* ✅ PAGE CONTAINER (RESTORES LAYOUT) */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          Profile
        </h1>

        <div
          style={{
            background: "#1F2937",
            border: "1px solid #374151",
            borderRadius: 14,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <ProfileField label="Email">
            {session.user.email}
          </ProfileField>

          <ProfileField label="Company">
            {companyName}
          </ProfileField>

          <ProfileField label="Role">
            {isAdmin ? "Admin" : "Member"}
          </ProfileField>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={() =>
              router.push(
                `/company/${company}/reset-password`
              )
            }
            className="btnPrimary"
          >
            Reset Password
          </button>
        </div>
      </div>
    </HeaderShell>
  );
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#F9FAFB",
        }}
      >
        {children}
      </div>
    </div>
  );
}
