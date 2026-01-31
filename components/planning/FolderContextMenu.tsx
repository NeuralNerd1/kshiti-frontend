"use client";

import { useEffect, useRef, useState } from "react";

export default function FolderContextMenu({
  onCreate,
  onRename,
  onDelete,
}: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="text-slate-400 hover:text-white px-2"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-white/10 bg-[#020617] shadow-xl z-50">
          <MenuItem onClick={onCreate}>New subfolder</MenuItem>
          <MenuItem onClick={onRename}>Rename</MenuItem>
          <MenuItem danger onClick={onDelete}>
            Delete
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick, danger }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-slate-200 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}
