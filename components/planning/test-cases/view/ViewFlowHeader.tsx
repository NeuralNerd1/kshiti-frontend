"use client";

type Props = {
  flowName: string;
  onBack: () => void;
  onImport: () => void;
  onEditImport: () => void;
};

export default function ViewFlowHeader({
  flowName,
  onBack,
  onImport,
  onEditImport,
}: Props) {
  return (
    <div className="builder-header">
      <div className="builder-header-row">
        <div className="flex items-center gap-14">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>

          <div className="builder-title">
            {flowName}
          </div>
        </div>

        <div className="builder-actions flex gap-10">
          <button
            className="import-flow-btn"
            onClick={onImport}
          >
            Import as whole
          </button>

          <button
            className="import-flow-btn"
            onClick={onEditImport}
          >
            Edit & Import
          </button>
        </div>
      </div>
    </div>
  );
}
