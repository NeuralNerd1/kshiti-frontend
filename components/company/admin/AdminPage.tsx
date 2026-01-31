"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import SectionCard from "@/components/layout/SectionCard";

export default function AdminPage({
  breadcrumbs,
  title,
  subtitle,
  children,
}: {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 24px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <Breadcrumbs items={breadcrumbs} />

      <PageHeader title={title} subtitle={subtitle} />

      <SectionCard>{children}</SectionCard>
    </div>
  );
}
