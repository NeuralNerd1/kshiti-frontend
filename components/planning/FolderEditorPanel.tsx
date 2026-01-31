"use client";

export default function FolderEditorPanel({
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
    <div className="max-w-md">
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
        placeholder="Folder name"
        defaultValue={target?.name}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(
              (e.target as HTMLInputElement).value
            );
          }
        }}
      />

      {error && (
        <div className="formError mb-3">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="btnSecondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="btnPrimary"
          onClick={() => {
            const input =
              document.querySelector<HTMLInputElement>(
                "input"
              );
            if (input?.value) onSubmit(input.value);
          }}
        >
          {mode === "create" ? "Create" : "Rename"}
        </button>
      </div>
    </div>
  );
}
