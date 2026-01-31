type ErrorStateProps = {
  message: string;
  retry?: () => void;
};

export default function ErrorState({
  message,
  retry,
}: ErrorStateProps) {
  return (
    <div className="card card-body" style={{ borderColor: "#fecaca" }}>
      <p style={{ color: "#b91c1c" }}>{message}</p>

      {retry && (
        <button
          className="btn btn-secondary"
          style={{ marginTop: 8 }}
          onClick={retry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
