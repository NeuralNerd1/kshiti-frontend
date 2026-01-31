"use client";

import { useState, useRef } from "react";
import { Flow } from "@/types/planning";
import FlowActionsMenu from "./FlowActionsMenu";

type Props = {
  flow: Flow;
};

export default function FlowRow({ flow }: Props) {
  const [open, setOpen] = useState(false);
  const kebabRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flow-row">
      <div className="flow-main">
        <div className="flow-text">
          <div className="flow-name">{flow.name}</div>
          {flow.description && (
            <div className="flow-desc">
              {flow.description}
            </div>
          )}
        </div>

        <button
          ref={kebabRef}
          className="flow-kebab"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          ⋮
        </button>
      </div>

      {open && (
  <FlowActionsMenu
    onEdit={() => {
      // same behavior as FlowCard
      setOpen(false);
    }}
    onArchive={async () => {
      setOpen(false);
    }}
    onDelete={async () => {
      setOpen(false);
    }}
    onClose={() => setOpen(false)}
  />
)}
    </div>
  );
}
