type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <div className="page-header-title">{title}</div>
        {subtitle && (
          <div className="page-header-subtitle">{subtitle}</div>
        )}
      </div>

      {actions && <div>{actions}</div>}
    </div>
  );
}
