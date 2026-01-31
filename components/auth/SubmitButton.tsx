"use client";

type SubmitButtonProps = {
  label: string;
  disabled?: boolean;
};

export default function SubmitButton({
  label,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: disabled ? "#9ca3af" : "#111827",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
