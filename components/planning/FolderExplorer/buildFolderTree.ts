import { PlanningFolder } from "@/types/planningFolderService";

export type FolderTreeNode = PlanningFolder & {
  children?: FolderTreeNode[];
};

export function buildFolderTree(
  folders: PlanningFolder[]
): FolderTreeNode[] {
  const map = new Map<number, FolderTreeNode>();
  const roots: FolderTreeNode[] = [];

  // initialize map
  folders.forEach((folder) => {
    map.set(folder.id, { ...folder, children: [] });
  });

  // build tree
  folders.forEach((folder) => {
    const node = map.get(folder.id)!;

    if (folder.parent) {
      const parentNode = map.get(folder.parent);
      parentNode?.children?.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
