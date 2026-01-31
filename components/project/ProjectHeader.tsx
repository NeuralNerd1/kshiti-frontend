"use client";

import { ProjectContext } from "@/types/project";
import ProjectUserMenu from "./ProjectUserMenu";

export default function ProjectHeader({
  project,
}: {
  project: ProjectContext;
}) {
  return (
    <header
      style={{
        height: 72,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>Project</div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          {project.name}
        </div>
      </div>

      <ProjectUserMenu />
    </header>
  );
}
