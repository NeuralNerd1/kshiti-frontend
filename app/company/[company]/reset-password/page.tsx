"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "@/hooks/useSession";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { resetPassword, logout } from "@/services/authService";

export default function ResetPasswordPage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  // 🔐 Session (REQUIRED for user-level check)
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  /* ======================================================
     RESET HANDLER (WITH USER-LEVEL GUARD)
  ====================================================== */
  async function handleReset(data: {
    email: string;
    newPassword: string;
  }) {
    // ⛔ Guard until session is ready
    if (session.loading || !session.authenticated) {
      return;
    }

    // 🔐 USER-LEVEL CHECK (CRITICAL FIX)
    if (data.email !== session.user.email) {
      setError(
        "You can only reset the password for your own account."
      );
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // 1️⃣ Reset password
      await resetPassword({
        email: data.email,
        new_password: data.newPassword,
      });

      // 2️⃣ Force logout
      localStorage.removeItem("access_token");
      await logout();

      // 3️⃣ Success state
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     REDIRECT AFTER SUCCESS
  ====================================================== */
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      router.replace(`/company/${company}/login`);
    }, 4000);

    return () => clearTimeout(timer);
  }, [success, company, router]);

  /* ======================================================
     SUCCESS STATE UI
  ====================================================== */
  if (success) {
    return (
      <div className="pageCenter">
        <div className="pageCard">
          <h1 className="pageTitle">
            Password Reset Successful
          </h1>
          <p className="pageSubtitle">
            You can now sign in using your new password.
            <br />
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  /* ======================================================
     DEFAULT RESET FORM
  ====================================================== */
  return (
    <div className="pageCenter">
      <div className="pageCard">
        {/* Header */}
        <h1 className="pageTitle">Reset Password</h1>
        <p className="pageSubtitle">
          Choose a new password for your account
        </p>

        {/* Form */}
        <div className="formSection">
          <ResetPasswordForm
            loading={loading}
            error={undefined} // error shown below to keep design consistent
            onSubmit={handleReset}
          />

          {/* Error */}
          {error && (
            <div className="formError">{error}</div>
          )}
        </div>

        {/* Actions */}
        <div className="formActions">
          <button
            type="button"
            className="btnSecondary"
            onClick={() =>
              router.push(`/company/${company}/login`)
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btnPrimary"
            disabled={loading}
            onClick={() => {
              const form =
                document.querySelector("form");
              form?.dispatchEvent(
                new Event("submit", {
                  cancelable: true,
                  bubbles: true,
                })
              );
            }}
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
