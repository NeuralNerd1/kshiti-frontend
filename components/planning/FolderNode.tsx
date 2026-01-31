"use client";

import { useState } from "react";
import FolderActionsMenu from "./FolderActionsMenu";
import { Folder } from "@/types/folder2";

export default function FolderNode({
  folder,
  depth,
  active,
  expanded,
  hasChildren,
  onToggle,
  onSelect,
  onCreateChild,
  onRename,
  onDelete,
  children,
}: {
  folder: Folder;
  depth: number;
  active: boolean;
  expanded: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  onSelect: (f: Folder) => void;
  onCreateChild: (f: Folder) => void;
  onRename: (f: Folder) => void;
  onDelete: (f: Folder) => void;
  children?: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div>
      <div
        className={`group flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${
          active ? "bg-indigo-500/15" : "hover:bg-white/5"
        }`}
        style={{ paddingLeft: depth * 16 + 8 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex items-center gap-1">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-slate-400 hover:text-white text-xs"
            >
              {expanded ? "▾" : "▸"}
            </button>
          )}
          <span
            className="text-sm truncate"
            onClick={() => onSelect(folder)}
          >
            {folder.name}
          </span>
        </div>

        {hover && (
          <FolderActionsMenu
            onCreate={() => onCreateChild(folder)}
            onRename={() => onRename(folder)}
            onDelete={() => onDelete(folder)}
          />
        )}
      </div>

      {children}
    </div>
  );
}
