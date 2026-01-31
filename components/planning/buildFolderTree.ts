// components/planning/buildFolderTree.ts
import type { PlanningFolder } from "@/services/planning/planningFolderService";
import type { FolderTreeNode } from "@/types/folder";

export function buildFolderTree(
  folders: PlanningFolder[]
): FolderTreeNode[] {
  const map = new Map<number, FolderTreeNode>();
  const roots: FolderTreeNode[] = [];

  folders.forEach((f) => {
    map.set(f.id, { ...f, children: [] });
  });

  map.forEach((node) => {
    if (node.parent && map.has(node.parent)) {
      map.get(node.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
