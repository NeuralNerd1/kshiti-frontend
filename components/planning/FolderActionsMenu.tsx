"use client";

import { useState } from "react";

export default function FolderActionsMenu({
  onCreate,
  onRename,
  onDelete,
}: {
  onCreate: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="text-slate-400 hover:text-white"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#020617] border border-white/10 rounded-md shadow-lg z-50">
          <button
            onClick={onCreate}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5"
          >
            New subfolder
          </button>
          <button
            onClick={onRename}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5"
          >
            Rename
          </button>
          <button
            onClick={onDelete}
            className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
