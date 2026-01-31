"use client";

import { useState, useMemo } from "react";
import { PlanningFolder } from "@/types/planningFolderService";

import { FolderNode } from "./FolderNode";
import { FolderModal } from "./FolderModal";
import "./folderExplorer.css";

/* ----------------------------------
   Build tree from flat folders
---------------------------------- */
type FolderTreeNode = PlanningFolder & {
  children: FolderTreeNode[];
};

function buildFolderTree(
  folders: PlanningFolder[]
): FolderTreeNode[] {
  const map = new Map<number, FolderTreeNode>();
  const roots: FolderTreeNode[] = [];

  folders.forEach((f) => {
    map.set(f.id, { ...f, children: [] });
  });

  folders.forEach((f) => {
    const node = map.get(f.id)!;

    if (f.parent) {
      const parent = map.get(f.parent);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/* ================================
   PURE UI COMPONENT
================================ */
export default function FolderExplorer({
  folders,
  activeId,
  onSelect,
  rootLabel = "All",
  canCreate = false,
  canEdit = false,
  onCreate,
  onRename,
  onDelete,
}: {
  folders: PlanningFolder[];
  activeId: string;
  onSelect: (id: string) => void;
  rootLabel?: string;

  canCreate?: boolean;
  canEdit?: boolean;

  onCreate?: (name: string, parentId: number | null) => void;
  onRename?: (id: number, name: string) => void;
  onDelete?: (id: number) => void;
}) {
  const tree = useMemo(
    () => buildFolderTree(folders),
    [folders]
  );

  const [modal, setModal] = useState<{
    type: "create" | "rename" | "delete";
    folderId?: number;
    parentId?: number | null;
  } | null>(null);

  return (
    <aside className="folder-explorer">
      {/* HEADER */}
      <div className="folder-header">
        <span>Folders</span>

        {canCreate && (
          <button
            className="new-folder-btn"
            onClick={() =>
              setModal({ type: "create", parentId: null })
            }
          >
            + New
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="folder-list">
        <div
          className={`folder-item ${
            activeId === "all" ? "active" : ""
          }`}
          onClick={() => onSelect("all")}
        >
          {rootLabel}
        </div>

        {tree.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            activeId={activeId}
            onSelect={onSelect}
            canEditFlows={canEdit}
            onAction={(action, id) => {
              if (action === "create") {
                setModal({
                  type: "create",
                  parentId: id,
                });
              }

              if (action === "rename") {
                setModal({
                  type: "rename",
                  folderId: id,
                });
              }

              if (action === "delete") {
                setModal({
                  type: "delete",
                  folderId: id,
                });
              }
            }}
          />
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <FolderModal
          type={modal.type}
          onClose={() => setModal(null)}
          onConfirm={async (value: string) => {
            if (
              modal.type === "create" &&
              onCreate
            ) {
              await onCreate(
                value,
                modal.parentId ?? null
              );
            }

            if (
              modal.type === "rename" &&
              modal.folderId &&
              onRename
            ) {
              await onRename(
                modal.folderId,
                value
              );
            }

            if (
              modal.type === "delete" &&
              modal.folderId &&
              onDelete
            ) {
              await onDelete(modal.folderId);
            }

            setModal(null);
          }}
        />
      )}
    </aside>
  );
}
