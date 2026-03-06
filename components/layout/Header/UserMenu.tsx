"use client";

import styles from "./Header.module.css";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";

export default function UserMenu({
  userName,
  showAdmin,
  onLogout,
  onGoProjects,
  onGoAdmin,
  onResetPassword,
  onGoProfile,
}: {
  userName: string;
  showAdmin?: boolean;
  onLogout: () => void;
  onGoProjects: () => void;
  onGoAdmin: () => void;
  onResetPassword: () => void;
  onGoProfile?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const session = useSession();

  // Use live session data if available, fall back to passed props
  const displayName =
    session.authenticated ? (session.user.display_name || session.user.email) : userName;
  const avatarUrl =
    session.authenticated ? session.user.avatar_url : null;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  function handleAction(action?: () => void) {
    setOpen(false);
    if (typeof action === "function") action();
  }

  return (
    <div className={styles.userMenu}>
      <div
        className={styles.userCard}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Avatar: image if set, else coloured initial */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className={styles.avatar}
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          <div className={styles.avatar}>{avatarLetter}</div>
        )}
        <span>{displayName}</span>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {/* Profile */}
          {onGoProfile && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleAction(onGoProfile)}
            >
              Edit Profile
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
