"use client";

export default function ProjectMenu({ project }: { project: any }) {
  const permissions = project.permissions || {};

  const isProjectAdmin =
    permissions.can_manage_project_users === true;

  return (
    <div className="relative">
  <button className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">
    Project Menu
  </button>

  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0E142A] shadow-xl">
    <div className="px-4 py-2 text-xs text-white/50">
      Project
    </div>

    <div className="border-t border-white/10">
      <button className="dropdown-item">Project Details</button>

      {isProjectAdmin && (
        <>
          <button className="dropdown-item">Project Users</button>
          <button className="dropdown-item">Project Roles</button>
          <button className="dropdown-item">Testing Configuration</button>
        </>
      )}
    </div>
  </div>
</div>

  );
}
