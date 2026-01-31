export type Folder = {
  id: number;
  name: string;
  path: string;
  parent: number | null;
};

export type Flow = {
  id: number;
  name: string;
  description: string;
  folder: number | null;
  status: "ACTIVE" | "ARCHIVED";
};
