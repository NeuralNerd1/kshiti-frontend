"use client";

import { ReactNode } from "react";
import ProjectHeader from "@/components/project/ProjectHeader";
import { useProject } from "@/hooks/projects/useProject";

export default function TestCasesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { project, loading, error } = useProject();

  if (loading) {
    return null;
  }

  if (!project || error) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-[#0b1020] text-white flex flex-col">
      <ProjectHeader project={project} />

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
