"use client";

type ErrorStateProps = {
  title: string;
  description?: string;
};

export default function ErrorState({
  title,
  description,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        padding: "24px",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        backgroundColor: "#fef2f2",
      }}
    >
      <h3 style={{ color: "#991b1b", marginBottom: "8px" }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: "#7f1d1d", fontSize: "14px" }}>
          {description}
        </p>
      )}
    </div>
  );
}
