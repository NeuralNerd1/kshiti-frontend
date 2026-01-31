"use client";

type LoaderProps = {
  label?: string;
};

export default function Loader({ label = "Loading…" }: LoaderProps) {
  return (
    <div
      aria-busy="true"
      style={{
        padding: "24px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      {label}
    </div>
  );
}
