"use client";

import Header from "@/components/layout/Header/Header";

export default function HeaderShell({
  children,
  userName,
  companyName,

  onGoHome,
  onGoProjects,
  onGoAdmin,

  onLogout,
  onGoProfile,
  onResetPassword,
}: {
  children: React.ReactNode;
  userName: string;
  companyName: string;
  onGoHome: () => void;
  onGoProjects?: () => void;
  onGoAdmin?: () => void;
  onLogout: () => void;
  onGoProfile: () => void;
  onResetPassword: () => void;
  
}) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header
  userName={userName}
  companyName={companyName}

  showHomeButton={!!onGoHome}

  onGoHome={onGoHome ?? (() => {})}
  onGoProjects={onGoProjects ?? (() => {})}
  onGoAdmin={onGoAdmin ?? (() => {})}

  onLogout={onLogout}
  onGoProfile={onGoProfile}
  onResetPassword={onResetPassword}
/>

      {/* ✅ CONTENT MUST BE FULL-WIDTH */}
      <main style={{ width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
