"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { login } from "@/services/authService";
import { authBaseStyles } from "@/styles/auth/base";
import { useSession } from "@/hooks/useSession";

export default function CompanyLoginPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleLogin(data: { email: string; password: string }) {
    setLoading(true);
    setError(undefined);

    try {
      const response = await login({
        company_slug: company,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("access_token", response.access);
      
      router.replace(`/company/${company}/dashboard`);
    } catch (err: any) {
  // Prefer backend error message
  if (err?.status === 401 || err?.status === 403) {
    setError("Invalid email or password");
  } else {
    setError(err?.message || "Login failed");
  }
}
 finally {
      setLoading(false);
    }
  }

  if (!session.loading && session.authenticated) {
  router.replace(`/company/${company}/dashboard`);
  return null;
}

  return (
    <div style={authBaseStyles.page}>
      <div style={authBaseStyles.card}>
        {/* Header */}
        <div style={authBaseStyles.header}>
          <h1 style={authBaseStyles.title}>Sign in</h1>
          <p style={authBaseStyles.subtitle}>
            Continue to <strong>{company}</strong>
          </p>
        </div>

        {/* Form */}
        <LoginForm
          companySlug={company}
          loading={loading}
          error={error}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}
