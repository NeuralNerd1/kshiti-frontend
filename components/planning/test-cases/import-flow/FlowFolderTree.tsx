"use client";

import { useState } from "react";

export default function FlowFolderTree({
  nodes,
  selectedId,
  onSelect,
}: any) {
  return (
    <div className="folder-tree">
      {nodes.map((n: any) => (
        <Node
          key={n.id}
          node={n}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function Node({
  node,
  selectedId,
  onSelect,
}: any) {
  const [open, setOpen] = useState(true);

  if (node.type === "folder") {
    return (
      <div>
        <div
          className="folder-item"
          onClick={() => setOpen(!open)}
        >
          ▶ {node.name}
        </div>

        {open &&
          node.children?.map((c: any) => (
            <Node
              key={c.id}
              node={c}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      className={`flow-item ${
        selectedId === node.id
          ? "active"
          : ""
      }`}
      onClick={() => onSelect(node)}
    >
      {node.name}
    </div>
  );
}
