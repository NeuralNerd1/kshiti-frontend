"use client";

import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProjectDashboard from "@/components/project/ProjectDashboard";

export default function ProjectOverviewPage() {
  const { company, project } = useParams<{
    company: string;
    project: string;
  }>();

  return (
    <div
      style={{
        maxWidth: 1200,
        padding: "24px 24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* ✅ SAME BREADCRUMBS COMPONENT AS PROJECT CREATE */}
      <Breadcrumbs
        items={[
          {
            label: "Projects",
            href: `/company/${company}/projects`,
          },
          {
            label: "Project Overview",
          },
        ]}
      />

      {/* Dashboard cards / content */}
      <ProjectDashboard />
    </div>
  );
}
