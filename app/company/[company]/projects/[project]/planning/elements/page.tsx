"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import FolderExplorer from "@/components/planning/FolderExplorer/FolderExplorer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchInput from "@/components/common/datatable/SearchInput";
import { toast } from "@/components/common/toast/toast";

import { useProject } from "@/hooks/projects/useProject";
import { useElementFolders } from "@/hooks/planning/elements/useElementFolders";
import { useElements } from "@/hooks/planning/elements/useElements";

import ElementsGrid from "@/components/planning/elements/ElementsGrid/ElementsGrid";
import CreateElementModal from "@/components/planning/elements/modals/CreateElementModal";
import EditElementModal from "@/components/planning/elements/modals/EditElementModal";
import ViewElementModal from "@/components/planning/elements/modals/ViewElementModal";

import { deleteElement } from "@/services/planning/elements/elementService";

import "./elementsPage.css";

export default function ElementsPage() {
  const { project, loading } = useProject();
  const projectId = project?.id ?? null;

  const router = useRouter();
  const params = useParams();

  const [selectedFolderId, setSelectedFolderId] =
    useState<string>("all");

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [viewElement, setViewElement] =
    useState<any>(null);

  const [editElement, setEditElement] =
    useState<any>(null);

  /* -----------------------------
     FOLDERS
  ------------------------------ */
  const {
    folders,
    canCreate,
    canEdit,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useElementFolders(projectId);

  const folderId =
    selectedFolderId === "all"
      ? undefined
      : Number(selectedFolderId);

  /* -----------------------------
     ELEMENTS
  ------------------------------ */
  const {
    elements,
    loading: elementsLoading,
    refresh,
  } = useElements(projectId, folderId);

  if (loading || !projectId) return null;

  const filtered = elements.filter((el) =>
    el.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flows-root">
      {/* LEFT */}
      <aside className="flows-sidebar">
        <FolderExplorer
          folders={folders}
          activeId={selectedFolderId}
          rootLabel="All Elements"
          canCreate={canCreate}
          canEdit={canEdit}
          onSelect={setSelectedFolderId}
          onCreate={(name, parentId) =>
  createFolder(name, parentId ?? undefined)
}
          onRename={renameFolder}
          onDelete={deleteFolder}
        />
      </aside>

      {/* RIGHT */}
      <main className="flows-content">
        <div className="flows-page-header">
          <Breadcrumbs
            items={[
              { label: "Overview", href: "../overview" },
              { label: "Elements" },
            ]}
          />

          <h1 className="flows-title">Elements</h1>

          <div className="flows-toolbar-row">
            <div className="flows-toolbar-left">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search elements"
              />
            </div>

            {folderId && (
              <button
                className="create-flow-btn"
                onClick={() => setShowCreate(true)}
              >
                + Create element
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        <ElementsGrid
          elements={filtered}
          loading={elementsLoading}
          onOpen={(id) => {
            const el = elements.find(
              (e) => e.id === id
            );
            setViewElement(el);
          }}
          onEdit={(el) => setEditElement(el)}
          onDelete={async (id) => {
            try {
              await deleteElement(id);
              toast.success("Element deleted");
              refresh();
            } catch {
              toast.error("Failed to delete element");
            }
          }}
        />
      </main>

      {/* CREATE */}
      {showCreate && folderId && (
        <CreateElementModal
          folderId={folderId}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            toast.success("Element created");
            setShowCreate(false);
            refresh();
          }}
        />
      )}

      {/* VIEW */}
      {viewElement && (
        <ViewElementModal
          element={viewElement}
          onClose={() => setViewElement(null)}
        />
      )}

      {/* EDIT */}
      {editElement && (
        <EditElementModal
          element={editElement}
          onClose={() => setEditElement(null)}
          onSaved={() => {
            toast.success("Element updated");
            setEditElement(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
