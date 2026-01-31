// components/project/sidebar/Sidebar.tsx

"use client";

import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

type SidebarProps = {
  projectSlug: string;
  showPlanning?: boolean;
  activeItem?: "flows" | "testCases" | "variables" | "elements";
};

export default function Sidebar({
  projectSlug,
  showPlanning = true,
  activeItem,
}: SidebarProps) {
  return (
    <nav
      style={{
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ===============================
          PLANNING SECTION
      ================================ */}
      {showPlanning && (
        <SidebarSection title="Planning" defaultOpen>
          <SidebarItem
            label="Flows"
            href={`/projects/${projectSlug}/planning/flows`}
            active={activeItem === "flows"}
          />

          <SidebarItem
            label="Test Cases"
            disabled
          />

          <SidebarItem
            label="Variables"
            disabled
          />

          <SidebarItem
            label="Elements"
            disabled
          />
        </SidebarSection>
      )}
    </nav>
  );
}
