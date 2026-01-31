export default function ProjectContent({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header (matches other pages) */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-white/60">{subtitle}</p>
          )}
        </div>

        {actions && <div>{actions}</div>}
      </div>

      {/* Page body */}
      <div className="rounded-xl border border-white/10 bg-[#0E142A] p-6">
        {children}
      </div>
    </div>
  );
}
