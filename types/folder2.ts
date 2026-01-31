export interface Folder {
  id: number;
  name: string;
  parent: number | null;
  children?: Folder[];
}