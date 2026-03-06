"use client";

import { useSession } from "@/hooks/useSession";
import { useState } from "react";
import { useProject } from "@/hooks/projects/useProject";
import { useRouter, useParams } from "next/navigation";

export default function ProjectUserMenu() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const { project } = useProject();

  const permissions = project?.permissions || {};
  const planningEnabled = project?.test_planning_enabled === true;
  const router = useRouter();
  const params = useParams();

  const company = params.company;
  const projectId = params.project;

  const hasTemplatePermission =
    permissions.can_create_templates ||
    permissions.can_submit_templates ||
    permissions.can_edit_templates ||
    permissions.can_create_planning_items ||
    permissions.can_approve_templates;

  const showTestConsole = planningEnabled && hasTemplatePermission;

  if (!user) return null;

  const displayName = user.display_name ?? user.email;
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 10px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          cursor: "pointer",
          color: "#FFFFFF",
        }}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={displayName}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {avatarLetter}
          </div>
        )}
        <span style={{ fontSize: 14, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 52,
            width: 220,
            borderRadius: 14,
            background: "#020617",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 8,
            zIndex: 100,
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 4,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{displayName}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{user.email}</div>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 14,
              cursor: "pointer",
              color: "#94a3b8",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            onClick={() => {
              router.push(`/company/${company}/profile`);
              setOpen(false);
            }}
          >
            Edit Profile
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 14,
              cursor: "pointer",
              color: "#94a3b8",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Project Console
          </div>

          {showTestConsole && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 14,
                cursor: "pointer",
                color: "#94a3b8",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              onClick={() => {
                router.push(
                  `/company/${company}/projects/${projectId}/test-console`
                );
                setOpen(false);
              }}
            >
              Test Console
            </div>
          )}
        </div>
      )}
    </div>
  );
}
