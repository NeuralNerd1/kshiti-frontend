import React from "react";

type ProjectEmptyStateProps = {
  action?: React.ReactNode;
};

export default function ProjectEmptyState({
  action,
}: ProjectEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      <h3 className="text-sm font-medium text-gray-900">
        No projects yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Projects help you organize work, assign responsibilities,
        and manage access within your company.
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
