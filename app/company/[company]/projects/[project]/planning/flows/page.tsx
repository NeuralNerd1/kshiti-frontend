"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import FolderExplorer from "@/components/planning/FolderExplorer/FolderExplorer";
import CreateFlowModal from "@/components/planning/flows/CreateFlowModal";
import EditFlowModal from "@/components/planning/flows/EditFlowModal";
import FlowsGrid from "@/components/planning/flows/FlowsGrid";

import type { Flow } from "@/types/planning";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchInput from "@/components/common/datatable/SearchInput";
import StatusFilter from "@/components/common/datatable/StatusFilter";
import { toast } from "@/components/common/toast/toast";

import { useProject } from "@/hooks/projects/useProject";
import { useFlows } from "@/hooks/planning/useFlows";
import { useFolders } from "@/hooks/planning/useFolders"; // ✅ ADD

import {
  createFlow,
  deleteFlow,
  archiveFlow,
} from "@/services/planning/flowService";

import "./flowsPage.css";

/* --------------------------------
   FLOW STATUS OPTIONS
--------------------------------- */
const flowStatusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export default function FlowsPage() {
  const { project, loading: projectLoading } = useProject();
  const projectId = project?.id ?? null;

  const router = useRouter();
  const params = useParams();

  const company = params.company as string;
  const projectSlug = params.project as string;

  /* --------------------------------
     UI STATE
  --------------------------------- */
  const [selectedFolderId, setSelectedFolderId] =
    useState<string>("all");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editingFlow, setEditingFlow] =
    useState<Flow | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<string>("all");

  /* --------------------------------
     FOLDER DATA (✅ SAME AS BEFORE)
  --------------------------------- */
  const {
    folders,
    canCreate: canCreateFolder,
    canEdit: canEditFolder,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useFolders(projectId);

  /* --------------------------------
     DERIVED
  --------------------------------- */
  const folderId =
    selectedFolderId === "all"
      ? undefined
      : Number(selectedFolderId);

  const {
    flows,
    loading: flowsLoading,
    canCreate,
    setFlows,
  } = useFlows(projectId, folderId);

  if (projectLoading || !projectId) return null;

  return (
    <div className="flows-root">
      {/* LEFT: FOLDERS */}
      <aside className="flows-sidebar">
        <FolderExplorer
          folders={folders}                 // ✅
          activeId={selectedFolderId}
          onSelect={setSelectedFolderId}
          rootLabel="All Flows"
          canCreate={canCreateFolder}       // ✅
          canEdit={canEditFolder}           // ✅
          onCreate={createFolder}            // ✅
          onRename={renameFolder}            // ✅
          onDelete={deleteFolder}            // ✅
        />
      </aside>

      {/* RIGHT: CONTENT */}
      <main className="flows-content">
        <div className="flows-page-header">
          <Breadcrumbs
            items={[
              { label: "Overview", href: "../overview" },
              { label: "Flows" },
            ]}
          />

          <h1 className="flows-title">Flows</h1>

          <div className="flows-toolbar-row">
            <div className="flows-toolbar-left">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search flows"
              />

              <StatusFilter
                value={status}
                onChange={setStatus}
                options={flowStatusOptions}
              />
            </div>

            {canCreate && (
              <button
                className="create-flow-btn"
                onClick={() => setCreateOpen(true)}
              >
                + Create flow
              </button>
            )}
          </div>
        </div>

        {/* FLOWS GRID */}
        <FlowsGrid
          flows={flows}
          loading={flowsLoading}
          onOpenFlow={(id) => {
            router.push(
              `/company/${company}/projects/${projectSlug}/planning/flows/${id}/builder`
            );
          }}
          onEditFlow={(flow) =>
  setEditingFlow({
    id: flow.id,
    name: flow.name,
    description: flow.description ?? "",
    folder: flow.folder ?? null,
    status:
      flow.status === "ACTIVE" || flow.status === "ARCHIVED"
        ? flow.status
        : flow.status.toUpperCase() === "ACTIVE"
        ? "ACTIVE"
        : "ARCHIVED",
  })
}
          onDeleteFlow={async (id) => {
            try {
              await deleteFlow(id);
              setFlows((prev) =>
                prev.filter((f) => f.id !== id)
              );
              toast.success("Flow deleted");
            } catch (e: any) {
              toast.error(
                e?.message || "Failed to delete flow"
              );
            }
          }}
          onArchiveFlow={async (id) => {
            try {
              await archiveFlow(id);
              setFlows((prev) =>
                prev.filter((f) => f.id !== id)
              );
              toast.success("Flow archived");
            } catch (e: any) {
              toast.error(
                e?.message || "Failed to archive flow"
              );
            }
          }}
        />
      </main>

      {/* CREATE FLOW MODAL */}
      {createOpen && (
        <CreateFlowModal
          onClose={() => setCreateOpen(false)}
          onCreate={async ({ name, description }) => {
            try {
              const newFlow = await createFlow(
                projectId,
                {
                  name,
                  description,
                  folder_id:
                    selectedFolderId === "all"
                      ? undefined
                      : Number(selectedFolderId),
                }
              );

              setFlows((prev) => [
                newFlow,
                ...prev,
              ]);
              toast.success("Flow created");
              setCreateOpen(false);
            } catch (e: any) {
              toast.error(
                e?.message || "Failed to create flow"
              );
            }
          }}
        />
      )}

      {/* EDIT FLOW MODAL */}
      {editingFlow && (
        <EditFlowModal
          flow={editingFlow}
          onClose={() =>
            setEditingFlow(null)
          }
          onUpdated={(updated) => {
            setFlows((prev) =>
              prev.map((f) =>
                f.id === updated.id
                  ? updated
                  : f
              )
            );
            toast.success("Flow updated");
          }}
        />
      )}
    </div>
  );
}
