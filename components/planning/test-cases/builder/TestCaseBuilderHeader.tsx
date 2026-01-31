"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  breadcrumbs: any[];

  testCaseName: string;

  versions?: {
    version_number: number;
  }[];

  currentVersion?: number | null;

  dirty?: boolean;
  saving?: boolean;

  onSave: () => void;
};

export default function TestCaseBuilderHeader({
  breadcrumbs,
  testCaseName,
  versions = [],
  currentVersion,
  dirty = false,
  saving = false,
  onSave,
}: Props) {
  return (
    <div className="builder-header">
      {/* BREADCRUMBS */}
      <Breadcrumbs items={breadcrumbs} />

      <div className="builder-header-row">
        {/* TITLE */}
        <h1 className="builder-title">
          {testCaseName}
        </h1>

        {/* ACTIONS */}
        <div className="builder-actions">
          <div className="builder-version-save">
            {/* VERSION LABEL */}
            {currentVersion !== null && (
              <div className="text-xs text-gray-400">
                Version v{currentVersion}
              </div>
            )}

            {/* SAVE BUTTON */}
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
