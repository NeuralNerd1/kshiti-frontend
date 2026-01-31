"use client";

import { useState } from "react";

import FolderExplorer from "@/components/planning/FolderExplorer/FolderExplorer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchInput from "@/components/common/datatable/SearchInput";
import { toast } from "@/components/common/toast/toast";

import { useProject } from "@/hooks/projects/useProject";
import { useVariableFolders } from "@/hooks/planning/variables/useVariableFolders";
import { useVariables } from "@/hooks/planning/variables/useVariables";

import VariablesGrid from "@/components/planning/variables/VariablesGrid";

import CreateVariableModal from "@/components/planning/variables/modals/CreateVariableModal";
import EditVariableModal from "@/components/planning/variables/modals/EditVariableModal";
import ViewVariableModal from "@/components/planning/variables/modals/ViewVariableModal";

import type { VariableFolder } from "@/services/planning/variables/variableFolderService";

type PlanningFolder = {
  id: number;
  name: string;
  parent: number | null;
  path: string;
};


import {
  deleteVariable,
} from "@/services/planning/variables/variableService";

import "./variablesPage.css";

export default function VariablesPage() {
  const { project, loading } = useProject();
  const projectId = project?.id ?? null;

  const [selectedFolderId, setSelectedFolderId] =
    useState<string>("all");

  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [viewVariable, setViewVariable] =
    useState<any>(null);

  const [editVariable, setEditVariable] =
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
  } = useVariableFolders(projectId);
  const planningFolders = adaptVariableFolders(folders);


 


  const folderId =
    selectedFolderId === "all"
      ? undefined
      : Number(selectedFolderId);

  /* -----------------------------
     VARIABLES
  ------------------------------ */

  const {
    variables,
    loading: variablesLoading,
    refresh,
  } = useVariables(projectId, folderId);

  if (loading || !projectId) return null;

  const filtered = variables.filter((v) =>
    v.key.toLowerCase().includes(search.toLowerCase())
  );

  function adaptVariableFolders(
  folders: VariableFolder[]
): PlanningFolder[] {
  const map = new Map<number, VariableFolder>();

  folders.forEach((f) => map.set(f.id, f));

  const buildPath = (folder: VariableFolder): string => {
    if (!folder.parent_id) return folder.name;

    const parent = map.get(folder.parent_id);
    if (!parent) return folder.name;

    return `${buildPath(parent)}/${folder.name}`;
  };

  

  return folders.map((f) => ({
    id: f.id,
    name: f.name,
    parent: f.parent_id ?? null,
    path: buildPath(f),
  }));
}

  


  return (
    <div className="flows-root">
      {/* LEFT */}
      <aside className="flows-sidebar">
        <FolderExplorer
          folders={planningFolders}
          activeId={selectedFolderId}
          rootLabel="All Variables"
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
              {
                label: "Overview",
                href: "../overview",
              },
              { label: "Variables" },
            ]}
          />

          <h1 className="flows-title">
            Variables
          </h1>

          <div className="flows-toolbar-row">
            <div className="flows-toolbar-left">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search variables"
              />
            </div>

            {folderId && (
              <button
                className="create-flow-btn"
                onClick={() =>
                  setShowCreate(true)
                }
              >
                + Create variable
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        <VariablesGrid
          variables={filtered}
          loading={variablesLoading}
          onView={setViewVariable}
          onEdit={setEditVariable}
          onDelete={async (id) => {
            try {
              await deleteVariable(id);
              toast.success(
                "Variable deleted"
              );
              refresh();
            } catch {
              toast.error(
                "Failed to delete variable"
              );
            }
          }}
        />
      </main>

      {/* CREATE */}
      {showCreate && folderId && (
        <CreateVariableModal
          folderId={folderId}
          onClose={() =>
            setShowCreate(false)
          }
          onCreated={() => {
            toast.success(
              "Variable created"
            );
            setShowCreate(false);
            refresh();
          }}
        />
      )}

      {/* VIEW */}
      {viewVariable && (
        <ViewVariableModal
          variable={viewVariable}
          onClose={() =>
            setViewVariable(null)
          }
        />
      )}

      {/* EDIT */}
      {editVariable && (
        <EditVariableModal
          variable={editVariable}
          onClose={() =>
            setEditVariable(null)
          }
          onSaved={() => {
            toast.success(
              "Variable updated"
            );
            setEditVariable(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
