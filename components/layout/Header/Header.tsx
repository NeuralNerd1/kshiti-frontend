"use client";

import styles from "./Header.module.css";
import UserMenu from "./UserMenu";

export default function Header({
  userName,
  companyName,
  showAdmin,

  // existing actions
  onLogout,
  onGoProjects,
  onGoAdmin,
  onResetPassword,

  // ✅ NEW (optional, safe)
  showHomeButton,
  onGoHome,
  onGoProfile,
}: {
  userName: string;
  companyName: string;
  showAdmin?: boolean;

  onLogout: () => void;
  onGoProjects: () => void;
  onGoAdmin: () => void;
  onResetPassword: () => void;

  // 🔹 optional props (won’t break existing usage)
  showHomeButton?: boolean;
  onGoHome?: () => void;
  onGoProfile?: () => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* ✅ Home button only when explicitly enabled */}
        {showHomeButton && onGoHome && (
          <button
            onClick={onGoHome}
            className={styles.homeButton}
            title="Go to Dashboard"
          >
            🏠
          </button>
        )}

        <span className={styles.companyName}>
          {companyName}
        </span>
      </div>

      <div className={styles.right}>
        <UserMenu
          userName={userName}
          showAdmin={showAdmin}
          onLogout={onLogout}
          onGoProjects={onGoProjects}
          onGoAdmin={onGoAdmin}
          onResetPassword={onResetPassword}
          onGoProfile={onGoProfile}
        />
      </div>
    </header>
  );
}
