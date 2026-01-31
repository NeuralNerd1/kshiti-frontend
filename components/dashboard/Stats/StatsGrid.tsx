import StatCard from "./StatCard";
import styles from "./Stats.module.css";
import { dashboardStats } from "../data/mockDashboardData";

export default function StatsGrid() {
  return (
    <div className={styles.grid}>
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </div>
  );
}
