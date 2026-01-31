"use client";

import { useState, FormEvent } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import AuthErrorMessage from "./AuthErrorMessage";

type ResetPasswordFormProps = {
  loading: boolean;
  error?: string;
  onSubmit: (data: { email: string; newPassword: string }) => void;
};

export default function ResetPasswordForm({
  loading,
  error,
  onSubmit,
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ email, newPassword });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
  <EmailInput value={email} onChange={setEmail} disabled={loading} />
  <PasswordInput
    value={newPassword}
    onChange={setNewPassword}
    disabled={loading}
  />
  {/* ❌ REMOVED SubmitButton */}
  <AuthErrorMessage message={error} />
</form>

  );
}
