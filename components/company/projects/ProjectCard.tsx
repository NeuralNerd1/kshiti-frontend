"use client";

import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: {
    id: number;
    name: string;
    description?: string;
    max_team_members?: number;
    created_at?: string;
  };
  onOpen?: () => void;
}) {
  return (
    <div
      className={styles.card}
      onClick={onOpen}
      role="button"
      tabIndex={0}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{project.name}</h3>
      </div>

      {project.description && (
        <p className={styles.description}>
          {project.description}
        </p>
      )}

      <div className={styles.meta}>
        {project.max_team_members && (
          <span>
            👥 {project.max_team_members} members
          </span>
        )}
        {project.created_at && (
          <span>
            📅{" "}
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
