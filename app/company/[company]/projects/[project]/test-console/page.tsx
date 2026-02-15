"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TestConsoleSidebar from "@/components/test-console/TestConsoleSidebar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import TemplatesGrid from "@/components/test-console/TemplatesGrid";
import CreateTemplateModal from "@/components/test-console/CreateTemplateModal";
import EditTemplateModal from "@/components/test-console/EditTemplateModal";
import ReviewNotificationBell from "@/components/test-console/ReviewNotificationBell";
import ReviewModal from "@/components/test-console/ReviewModal";
import KanbanConfigBoard from "@/components/test-console/KanbanConfigBoard";

import { useProject } from "@/hooks/projects/useProject";
import { useTemplates } from "@/hooks/test-plan/useTemplates";

import { toast } from "@/components/common/toast/toast";
import type { ProcessTemplate } from "@/types/testPlan";

import "@/styles/test-console/testConsole.css";

export default function TestConsolePage() {
  const { project, loading: projectLoading } = useProject();
  const projectId = project?.id ?? null;

  const params = useParams();
  const router = useRouter();
  const company = params.company as string;
  const projectSlug = params.project as string;

  /* --------------------------------
     UI STATE
  --------------------------------- */
  const [activeSidebarItem, setActiveSidebarItem] = useState("templates");
  const [showCreate, setShowCreate] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<ProcessTemplate | null>(null);
  const [reviewingTemplate, setReviewingTemplate] =
    useState<ProcessTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "KANBAN">("GRID");

  /* --------------------------------
     DATA
  --------------------------------- */
  const {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refresh,
  } = useTemplates(projectId);

  if (projectLoading || !projectId) return null;

  /* --------------------------------
     NAVIGATE TO DETAIL
  --------------------------------- */
  const navigateToDetail = (template: ProcessTemplate) => {
    router.push(
      `/company/${company}/projects/${projectSlug}/test-console/templates/${template.id}`
    );
  };

  /* ---- CLIENT-SIDE FILTERING ---- */
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="test-console-root">
      {/* SIDEBAR */}
      <aside>
        <TestConsoleSidebar
          activeId={activeSidebarItem}
          onSelect={setActiveSidebarItem}
        />
      </aside>

      {/* MAIN CONTENT */}
      <main className="test-console-content">
        {/* HEADER */}
        <div className="test-console-page-header">
          <Breadcrumbs
            items={[
              {
                label: "Overview",
                href: `/company/${company}/projects/${projectSlug}`,
              },
              { label: "Test Console" },
            ]}
          />

          <h1 className="test-console-title">Test Plan Templates</h1>

          <div className="test-console-toolbar">
            <input
              className="template-search-input"
              type="text"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="template-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVAL_PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="CREATED">Created</option>
              <option value="ACTIVATED">Activated</option>
            </select>
            <ReviewNotificationBell
              projectId={projectId}
              onReview={(t) => setReviewingTemplate(t)}
            />
            <div className="view-switcher">
              <button
                className={`view-switch-btn ${viewMode === "GRID" ? "active" : ""}`}
                onClick={() => setViewMode("GRID")}
                title="Grid View"
              >
                田
              </button>
              <button
                className={`view-switch-btn ${viewMode === "KANBAN" ? "active" : ""}`}
                onClick={() => setViewMode("KANBAN")}
                title="Kanban Board"
              >
                📋
              </button>
            </div>
            <button
              className="create-template-btn"
              onClick={() => setShowCreate(true)}
            >
              + Create Template
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {viewMode === "GRID" ? (
          <TemplatesGrid
            templates={filteredTemplates}
            loading={loading}
            onClick={navigateToDetail}
            onEdit={(template) => setEditingTemplate(template)}
            onDelete={async (templateId) => {
              try {
                await deleteTemplate(templateId);
                toast.success("Template deleted");
              } catch (e: any) {
                toast.error(e?.message || "Failed to delete template");
              }
            }}
          />
        ) : (
          <KanbanConfigBoard projectId={projectId} />
        )}
      </main>

      {/* CREATE MODAL */}
      {showCreate && (
        <CreateTemplateModal
          onClose={() => setShowCreate(false)}
          onCreate={async ({ name, description }) => {
            try {
              await createTemplate({ name, description });
              toast.success("Template created");
              setShowCreate(false);
            } catch (e: any) {
              toast.error(e?.message || "Failed to create template");
            }
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSave={async ({ name, description }) => {
            try {
              await updateTemplate(editingTemplate.id, { name, description });
              toast.success("Template updated");
              setEditingTemplate(null);
            } catch (e: any) {
              toast.error(e?.message || "Failed to update template");
            }
          }}
        />
      )}

      {/* REVIEW MODAL */}
      {reviewingTemplate && (
        <ReviewModal
          projectId={projectId}
          template={reviewingTemplate}
          onClose={() => setReviewingTemplate(null)}
          onComplete={() => {
            setReviewingTemplate(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
