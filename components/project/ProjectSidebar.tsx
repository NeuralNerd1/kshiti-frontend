"use client";

import { useRouter, usePathname } from "next/navigation";
import { ProjectContext } from "@/types/project";

export default function ProjectSidebar({
  project,
}: {
  project: ProjectContext;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 280,
        background: "#020617",
        padding: 16,
      }}
    >
      {/* Container */}
      <div
        style={{
          height: "100%",
          borderRadius: 18,
          background: "#0B1020",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 52,
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          LOGO
        </div>

        <SidebarSection title="Test Planning">
          <Item label="Flows" path="planning/flows" />
          <Item label="Test Cases" path="planning/test-cases" />
          <Item label="Variables" path="planning/variables" />
          <Item label="Elements" path="planning/elements" />
          <Item label="Global Files" path="planning/files" />
        </SidebarSection>

        <SidebarSection title="Process & Planning">
          <Item label="Configure Test Process" path="process/configure" />
          <Item label="Bugs" path="bugs" />
        </SidebarSection>

        <SidebarSection title="Test Execution">
          <Item label="Test Suite" path="execution/test-suite" />
          <Item label="Local Test Cases" path="execution/local-test-cases" />
          <Item label="Execution Engine" path="execution/engine" />
          <Item label="Local Files" path="execution/files" />
        </SidebarSection>
      </div>
    </aside>
  );

  function Item({ label, path }: { label: string; path: string }) {
    const active = pathname.endsWith(path);

    return (
      <button
        onClick={() => {
          if (path === "execution/engine") {
            const token = localStorage.getItem("access_token");
            window.open(`http://localhost:3000/?token=${token}`, "_blank");
          } else {
            router.push(path);
          }
        }}
        style={{
          height: 44,
          borderRadius: 12,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          background: active
            ? "linear-gradient(135deg,#6366F1,#7C3AED)"
            : "transparent",
          color: active ? "#fff" : "#CBD5F5",
          border: "none",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6B7280",
          marginBottom: 8,
          paddingLeft: 8,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}
