type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="card card-body" style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      <p style={{ marginTop: 8 }}>{description}</p>
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}
