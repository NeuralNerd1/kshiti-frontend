"use client";

export default function Loader({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/70">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        {label && <div className="text-sm">{label}</div>}
      </div>
    </div>
  );
}
