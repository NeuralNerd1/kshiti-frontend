"use client";

import ProjectCard from "./ProjectCard";
import styles from "./ProjectList.module.css";
import { useRouter, useParams } from "next/navigation";

export default function ProjectList({
  projects,
}: {
  projects: any[];
}) {
  const router = useRouter();
  const { company } = useParams<{ company: string }>();

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={() =>
            router.push(
              `/company/${company}/projects/${project.id}`
            )
          }
        />
      ))}
    </div>
  );
}
