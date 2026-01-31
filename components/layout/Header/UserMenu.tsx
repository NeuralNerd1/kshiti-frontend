"use client";

import styles from "./Header.module.css";
import { useState } from "react";

export default function UserMenu({
  userName,
  showAdmin,

  onLogout,
  onGoProjects,
  onGoAdmin,
  onResetPassword,
  onGoProfile, // ✅ optional
}: {
  userName: string;
  showAdmin?: boolean;

  onLogout: () => void;
  onGoProjects: () => void;
  onGoAdmin: () => void;
  onResetPassword: () => void;
  onGoProfile?: () => void; // ✅ OPTIONAL
}) {
  const [open, setOpen] = useState(false);

  function handleAction(action?: () => void) {
    setOpen(false);
    if (typeof action === "function") {
      action();
    }
  }

  return (
    <div className={styles.userMenu}>
      <div
        className={styles.userCard}
        onClick={() => setOpen((v) => !v)}
      >
        <div className={styles.avatar}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <span>{userName}</span>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {/* ✅ Profile (only if handler exists) */}
          {onGoProfile && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleAction(onGoProfile)}
            >
              Profile
            </div>
          )}

          {/* Projects */}
          <div
            className={styles.dropdownItem}
            onClick={() => handleAction(onGoProjects)}
          >
            Projects Console
          </div>

          {/* Reset password */}
          <div
            className={styles.dropdownItem}
            onClick={() => handleAction(onResetPassword)}
          >
            Reset Password
          </div>

          {/* Admin (permission-gated) */}
          {showAdmin && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleAction(onGoAdmin)}
            >
              Admin Console
            </div>
          )}

          <div className={styles.divider} />

          {/* Logout */}
          <div
            className={styles.dropdownItemDanger}
            onClick={() => handleAction(onLogout)}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}
