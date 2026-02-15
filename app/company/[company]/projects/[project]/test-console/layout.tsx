"use client";

import { ReactNode } from "react";
import ProjectHeader from "@/components/project/ProjectHeader";
import { useProject } from "@/hooks/projects/useProject";
import ErrorState from "@/components/layout/ErrorState";

export default function TestConsoleLayout({
    children,
}: {
    children: ReactNode;
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

    return (
        <div className="h-screen w-full bg-[#0b1020] text-white flex flex-col">
            <ProjectHeader project={project} />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
