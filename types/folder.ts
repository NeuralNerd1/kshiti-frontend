export type FolderTreeNode = {
  id: number;
  name: string;
  path: string;
  parent: number | null;
  children: FolderTreeNode[];
};
