"use client";

export default function FolderEditorCard({
  mode,
  parent,
  target,
  error,
  onCancel,
  onSubmit,
}: {
  mode: "create" | "rename";
  parent?: any;
  target?: any;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  return (
    <div className="max-w-md mx-auto bg-[#020617] border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-2">
        {mode === "create" ? "Create Folder" : "Rename Folder"}
      </h2>

      <p className="text-sm text-slate-400 mb-4">
        {mode === "create"
          ? parent
            ? `Inside ${parent.name}`
            : "At root level"
          : `Renaming ${target?.name}`}
      </p>

      <input
        autoFocus
        className="formInput w-full mb-4"
        defaultValue={target?.name}
        placeholder="Folder name"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit((e.target as HTMLInputElement).value);
          }
        }}
      />

      {error && <div className="formError mb-3">{error}</div>}

      <div className="flex gap-2 justify-end">
        <button className="btnSecondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btnPrimary"
          onClick={() => {
            const input =
              document.querySelector<HTMLInputElement>("input");
            if (input?.value) onSubmit(input.value);
          }}
        >
          {mode === "create" ? "Create" : "Rename"}
        </button>
      </div>
    </div>
  );
}
