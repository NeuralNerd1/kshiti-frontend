// services/planningFolderService.ts

export type PlanningFolder = {
  id: number;
  name: string;
  path: string;
  parent: number | null;
};
