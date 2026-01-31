"use client";

import { useParams } from "next/navigation";
import styles from "./Sidebar.module.css"; // ✅ REQUIRED
import { getSidebarItems } from "./sidebar.config";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const { company } = useParams<{ company: string }>();
  const items = getSidebarItems(company);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoBox}>LOGO</div>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}
