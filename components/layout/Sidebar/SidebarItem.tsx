"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import { SidebarItemConfig } from "./sidebar.config";
import { usePathname } from "next/navigation";

export default function SidebarItem({
  item,
}: {
  item: SidebarItemConfig;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (item.disabled) {
    return (
      <div className={`${styles.item} ${styles.disabled}`}>
        {item.label}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${styles.item} ${isActive ? styles.active : ""}`}
    >
      {item.label}
    </Link>
  );
}
