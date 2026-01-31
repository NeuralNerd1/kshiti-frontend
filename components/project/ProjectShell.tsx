"use client";

import { useProject } from "@/hooks/projects/useProject";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import ProjectSidebar from "./ProjectSidebar";
import ProjectHeader from "./ProjectHeader";

export default function ProjectShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { project, loading, error } = useProject();

  if (loading) {
    return <Loader label="Loading project…" />;
  }

  if (error || !project) {
    return (
      <ErrorState
        title="Project not found"
        description="You don’t have access to this project."
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0B1020",
        color: "#E5E7EB",
      }}
    >
      <ProjectSidebar project={project} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <ProjectHeader project={project} />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
