"use client";

import { useState } from "react";
import { FolderItem } from "./FolderItem";
import { PlanningFolder } from "@/types/planningFolderService";

type FolderTreeNode = PlanningFolder & {
  children?: FolderTreeNode[];
};

type Props = {
  folder: FolderTreeNode;
  level: number;
  activeId: string;
  onSelect: (id: string) => void;
  canEditFlows: boolean;
  onAction: (
    action: "create" | "rename" | "delete",
    id: number
  ) => void;
};

export function FolderNode({
  folder,
  level,
  activeId,
  onSelect,
  canEditFlows,
  onAction,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!folder.children?.length;

  return (
    <>
      <FolderItem
        id={folder.id}
        name={folder.name}
        level={level}
        activeId={activeId}
        onSelect={onSelect}
        canEditFlows={canEditFlows}
        hasChildren={hasChildren}
        isExpanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        onAction={onAction}
      />

      {expanded &&
        folder.children?.map((child) => (
          <FolderNode
            key={child.id}
            folder={child}
            level={level + 1}
            activeId={activeId}
            onSelect={onSelect}
            canEditFlows={canEditFlows}
            onAction={onAction}
          />
        ))}
    </>
  );
}
