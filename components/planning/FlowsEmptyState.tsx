export default function FlowsEmptyState() {
  return (
    <div className="w-[420px] rounded-xl border border-white/10 bg-white/5 p-6 text-center">
      <h3 className="text-lg font-medium text-white mb-2">
        No folder selected
      </h3>
      <p className="text-sm text-white/60">
        Select a folder from the sidebar to view its flows.
      </p>
    </div>
  );
}
