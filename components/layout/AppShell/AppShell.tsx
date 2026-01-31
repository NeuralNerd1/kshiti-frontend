"use client";

import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import styles from "./AppShell.module.css";

export default function AppShell({
  children,
  userName,
  companyName,
  companySlug,
  showAdmin,

  onLogout,
  onGoProjects,
  onGoAdmin,
  onResetPassword,
}: {
  children: React.ReactNode;
  userName: string;
  companySlug: string;
  showAdmin?: boolean;
  hideSidebar?: boolean;
  companyName: string;
  onLogout: () => void;
  onGoProjects: () => void;
  onGoAdmin: () => void;
  onResetPassword: () => void;
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.main}>
        <Header
  userName={userName}
  companyName={companyName}
  showAdmin={showAdmin}

  onLogout={onLogout}
  onGoProjects={onGoProjects}
  onGoAdmin={onGoAdmin}
  onResetPassword={onResetPassword}

  // ✅ ADD THIS
  onGoProfile={() =>
    window.location.href = `/company/${companySlug}/profile`
  }
/>


        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
