"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  breadcrumbs: any[];
  flowName: string;

  versions?: {
    version_number: number;
    created_from_version: number | null;
  }[];

  currentVersion?: number | null;
  activeVersion?: number | null;

  saving?: boolean;
  dirty?: boolean;

  onVersionChange?: (v: number) => void;
  onSave: () => void;
};

export default function FlowBuilderHeader({
  breadcrumbs,
  flowName,
  versions = [],
  currentVersion,
  activeVersion, // ✅ IMPORTANT FIX
  dirty,
  saving = false,
  onVersionChange,
  onSave,
}: Props) {
  return (
    <div className="builder-header">
      <Breadcrumbs items={breadcrumbs} />

      <div className="builder-header-row">
        <h1 className="builder-title">{flowName}</h1>

        <div className="builder-actions">
  <div className="builder-version-save">
          {/* VERSION DROPDOWN */}
          {versions.length > 0 && (
            <select
              className="formSelect"
              value={currentVersion ?? ""}
              onChange={(e) =>
                onVersionChange?.(Number(e.target.value))
              }
            >
              {versions.map((v) => (
                <option
                  key={v.version_number}
                  value={v.version_number}
                >
                  v{v.version_number}
                  {v.version_number === activeVersion
                    ? " (active)"
                    : ""}
                </option>
              ))}
            </select>
          )}

          {/* SAVE */}
          <button
            className="btnPrimary"
            disabled={saving || dirty === false}
            onClick={onSave}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
