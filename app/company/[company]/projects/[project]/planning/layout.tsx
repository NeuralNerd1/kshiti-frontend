"use client";

import { useProject } from "@/hooks/projects/useProject";
import ErrorState from "@/components/layout/ErrorState";

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { project, loading, error } = useProject();

  if (loading) return null;

  if (error || !project) {
    return (
      <ErrorState
  message={
    error ?? "Unable to load project. Project context not available."
  }
/>
    );
  }

  /**
   * IMPORTANT:
   * - NO header
   * - NO sidebar
   * - NO full-height container
   * - NO background
   */
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {children}
    </div>
  );
}
