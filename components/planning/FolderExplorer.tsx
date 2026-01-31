"use client";

import { useState } from "react";

type Folder = {
  name: string;
  children?: Folder[];
};

const DATA: Folder[] = [
  {
    name: "Acme Corp",
    children: [
      { name: "Signin 2" },
      { name: "Folder 2" },
    ],
  },
];

export default function FolderExplorer({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  return (
    <div className="text-sm px-2 py-3">
      <div className="mb-2 px-2 text-xs font-semibold tracking-wide text-white/50">
        EXPLORER
      </div>

      {DATA.map((folder) => (
        <FolderNode
          key={folder.name}
          folder={folder}
          level={0}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function FolderNode({
  folder,
  level,
  onSelect,
}: {
  folder: Folder;
  level: number;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!folder.children?.length;

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-white/5"
        style={{ paddingLeft: 8 + level * 14 }}
        onClick={() => onSelect(folder.name)}
      >
        {hasChildren ? (
          <span
            className="w-3 text-white/60"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? "▾" : "▸"}
          </span>
        ) : (
          <span className="w-3" />
        )}

        <span className="truncate">{folder.name}</span>
      </div>

      {open &&
        folder.children?.map((child) => (
          <FolderNode
            key={child.name}
            folder={child}
            level={level + 1}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
