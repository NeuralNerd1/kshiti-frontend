"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

type Folder = {
  id: number;
  name: string;
  parent: number | null;
  path: string;
};

export default function TestCaseFolderExplorer({
  activeId,
  onSelect,
  projectId,
  rootLabel = "All Test Cases",
}: {
  activeId: string;
  onSelect: (id: string) => void;
  projectId: number;
  rootLabel?: string;
}) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    api
      .get(
        `/planning/test-cases/folders/list/?project_id=${projectId}`
      )
      .then((res) => setFolders(res.data));
  }, [projectId]);

  return (
    <div>
      <div
        className={`folder-item ${
          activeId === "all" ? "active" : ""
        }`}
        onClick={() => onSelect("all")}
      >
        {rootLabel}
      </div>

      {folders.map((f) => (
        <div
          key={f.id}
          className={`folder-item ml-3 ${
            activeId === String(f.id)
              ? "active"
              : ""
          }`}
          onClick={() => onSelect(String(f.id))}
        >
          {f.path}
        </div>
      ))}
    </div>
  );
}
