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

const showTestConsole =
  planningEnabled && hasTemplatePermission;


  if (!user) return null;

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
          }}
        >
          {user.email[0].toUpperCase()}
        </div>
        <span style={{ fontSize: 14 }}>{user.email}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 48,
            width: 220,
            borderRadius: 14,
            background: "#020617",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 8,
          }}
        >
          <>
  <div
    style={{
      padding: "10px 12px",
      borderRadius: 10,
      fontSize: 14,
      cursor: "pointer",
    }}
  >
    Profile
  </div>

  <div
    style={{
      padding: "10px 12px",
      borderRadius: 10,
      fontSize: 14,
      cursor: "pointer",
    }}
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
    }}
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
</>


          
        </div>
      )}
    </div>
  );
}
