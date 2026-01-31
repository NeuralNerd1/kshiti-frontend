"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

type Folder = {
  id: number;
  name: string;
  parent: number | null;
};

type Flow = {
  id: number;
  name: string;
  status: string;
  folder_id: number | null;
};

export default function ImportFlowModal({
  open,
  projectId,
  testCaseId,
  section,
  onClose,
  onView,
  onImport,
  onEditImport,
}: {
  open: boolean;
  projectId: number;
  testCaseId: number;
  section: "pre_conditions" | "steps" | "expected_outcomes";

  onClose: () => void;
  onView: (flowId: number) => void;
  onImport: (flowId: number) => void;
  onEditImport: (flowId: number) => void;
})
 {
  const [mounted, setMounted] =
    useState(false);

  const [folders, setFolders] =
    useState<Folder[]>([]);

  const [flows, setFlows] =
    useState<Flow[]>([]);

  const [expanded, setExpanded] =
    useState<number[]>([]);

  const [selectedFlow, setSelectedFlow] =
    useState<Flow | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    Promise.all([
      api.get(
        `/planning/projects/${projectId}/folders/`
      ),
      api.get(
        `/planning/projects/${projectId}/flows/`
      ),
    ]).then(([fRes, flRes]) => {
      setFolders(fRes.data);

      // ✅ only SAVED flows
      setFlows(
        flRes.data.filter(
          (f: Flow) => f.status === "SAVED"
        )
      );
    });
  }, [open, projectId]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="import-flow-modal">
        <h2>Import Flow</h2>

        {/* TREE */}
        <div className="import-tree">
          {folders
            .filter((f) => f.parent === null)
            .map((folder) => (
              <FolderNode
                key={folder.id}
                folder={folder}
                folders={folders}
                flows={flows}
                expanded={expanded}
                setExpanded={setExpanded}
                onSelectFlow={setSelectedFlow}
                selectedFlow={selectedFlow}
              />
            ))}

          {/* ROOT FLOWS */}
          {flows
            .filter(
              (f) => f.folder_id === null
            )
            .map((flow) => (
              <div
                key={flow.id}
                className={`flow-item ${
                  selectedFlow?.id ===
                  flow.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedFlow(flow)
                }
              >
                {flow.name}
              </div>
            ))}
        </div>

        {/* FOOTER */}
        <div className="modal-footer import-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <div className="import-btn-group">
            <button
              disabled={!selectedFlow}
              className="btn-secondary"
              onClick={() =>
                selectedFlow &&
                onView(selectedFlow.id)
              }
            >
              View
            </button>

            <button
              disabled={!selectedFlow}
              className="btn-secondary"
              onClick={() =>
                selectedFlow &&
                onEditImport(selectedFlow.id)
              }
            >
              Edit & Import
            </button>

            <button
              disabled={!selectedFlow}
              className="btn-primary"
              onClick={() =>
                selectedFlow &&
                onImport(selectedFlow.id)
              }
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

/* ================================ */

function FolderNode({
  folder,
  folders,
  flows,
  expanded,
  setExpanded,
  onSelectFlow,
  selectedFlow,
}: any) {
  const isOpen = expanded.includes(folder.id);

  return (
    <div>
      <div
        className="folder-item"
        onClick={() =>
          setExpanded((prev: number[]) =>
            prev.includes(folder.id)
              ? prev.filter((x) => x !== folder.id)
              : [...prev, folder.id]
          )
        }
      >
        ▶ {folder.name}
      </div>

      {isOpen && (
        <div className="ml-4">
          {folders
            .filter(
              (f: any) =>
                f.parent === folder.id
            )
            .map((f: any) => (
              <FolderNode
                key={f.id}
                folder={f}
                folders={folders}
                flows={flows}
                expanded={expanded}
                setExpanded={setExpanded}
                onSelectFlow={onSelectFlow}
                selectedFlow={selectedFlow}
              />
            ))}

          {flows
            .filter(
              (flow: any) =>
                flow.folder_id === folder.id
            )
            .map((flow: any) => (
              <div
                key={flow.id}
                className={`flow-item ${
                  selectedFlow?.id ===
                  flow.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onSelectFlow(flow)
                }
              >
                {flow.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
