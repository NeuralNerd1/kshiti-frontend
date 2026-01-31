"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectBreadcrumbs({
  projectName,
}: {
  projectName: string;
}) {
  const { company } = useParams<{ company: string }>();

  return (
    <nav className="text-xs text-white/60">
      <Link
        href={`/company/${company}/projects`}
        className="hover:text-white"
      >
        Projects
      </Link>
      <span className="mx-2">/</span>
      <span className="text-white">{projectName}</span>
    </nav>
  );
}
