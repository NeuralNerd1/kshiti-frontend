"use client";

import React from "react";
import ProjectCreateForm, {
  ProjectCreateFormProps,
} from "./ProjectCreateForm";

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  users: { id: number; email: string }[];
  onSubmit: ProjectCreateFormProps["onSubmit"];
  loading?: boolean;
  error?: string;
};

export default function CreateProjectModal({
  open,
  onClose,
  users,
  onSubmit,
  loading,
  error,
}: CreateProjectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Create project
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <ProjectCreateForm
          users={users}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
