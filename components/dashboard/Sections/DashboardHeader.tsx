import styles from "./Section.module.css";

export default function DashboardHeader() {
  return (
    <div className={styles.header}>
      <h1>Dashboard</h1>
      <p>Overview of projects, teams, and activity</p>
    </div>
  );
}
