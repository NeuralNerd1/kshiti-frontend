"use client";

type AuthErrorMessageProps = {
  message?: string;
};

export default function AuthErrorMessage({
  message,
}: AuthErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      style={{
        color: "#b91c1c",
        fontSize: "13px",
        marginTop: "8px",
      }}
    >
      {message}
    </p>
  );
}
