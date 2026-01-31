"use client";

import { useState } from "react";

type Props = {
  title: string;
  initialName?: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

export default function FolderModal({
  title,
  initialName = "",
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState(initialName);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#020617] rounded-xl p-6 w-[360px] border border-white/10">
        <h3 className="text-white font-semibold mb-4">{title}</h3>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Folder name"
          className="w-full px-3 py-2 rounded-md bg-black/40 text-white border border-white/10 outline-none"
        />

        <div className="flex justify-end gap-2 mt-5">
          <button className="btnSecondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btnPrimary"
            disabled={!name.trim()}
            onClick={() => onSubmit(name.trim())}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
