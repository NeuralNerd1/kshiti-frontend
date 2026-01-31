export type ProjectContext = {
  id: number;
  name: string;
  permissions: Record<string, boolean>;
  flows_enabled: boolean;
  test_cases_enabled: boolean;
  builder_enabled: boolean;
  execution_enabled: boolean;
  reports_enabled: boolean;
};


