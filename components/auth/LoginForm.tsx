"use client";

import { useState, FormEvent } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import AuthErrorMessage from "./AuthErrorMessage";

type LoginFormProps = {
  companySlug: string;
  loading: boolean;
  error?: string;
  onSubmit: (data: { email: string; password: string }) => void;
};

export default function LoginForm({
  companySlug,
  loading,
  error,
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
      <EmailInput value={email} onChange={setEmail} disabled={loading} />
      <PasswordInput
        value={password}
        onChange={setPassword}
        disabled={loading}
      />
      <SubmitButton label="Login" disabled={loading} />
      <AuthErrorMessage message={error} />
    </form>
  );
}
