"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "@/hooks/useSession";
import { useCompanyName } from "@/hooks/useCompanyName";
import { useProfile } from "@/hooks/useProfile";
import { getCompanyUsers } from "@/services/userService";
import { logout } from "@/services/authService";
import { toast } from "@/components/common/toast/toast";

import HeaderShell from "@/components/layout/HeaderShell/HeaderShell";

export default function ProfilePage() {
  const { company } = useParams<{ company: string }>();
  const router = useRouter();

  const session = useSession();
  const companyName = useCompanyName(company);
  const { profile, loading, saving, error, refresh, updateDisplayName, uploadAvatar, removeAvatar } = useProfile();

  const [isAdmin, setIsAdmin] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile on mount
  useEffect(() => {
    refresh();
  }, []);

  // Sync local input once profile loads
  useEffect(() => {
    if (profile) {
      setDisplayNameInput(profile.display_name ?? "");
    }
  }, [profile]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getCompanyUsers();
        if (!cancelled) setIsAdmin(true);
      } catch {
        // not admin
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleLogout() {
    localStorage.removeItem("access_token");
    await logout();
    router.replace(`/company/${company}/login`);
  }

  async function handleSaveName() {
    try {
      await updateDisplayName(displayNameInput);
      toast.success("Display name updated.");
    } catch {
      toast.error("Failed to update name.");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview
    const reader = new FileReader();
    reader.onload = evt => setAvatarPreview(evt.target?.result as string);
    reader.readAsDataURL(file);
    // Upload
    try {
      await uploadAvatar(file);
      toast.success("Avatar updated.");
    } catch {
      toast.error("Failed to upload avatar.");
      setAvatarPreview(null);
    }
  }

  async function handleRemoveAvatar() {
    try {
      await removeAvatar();
      setAvatarPreview(null);
      toast.success("Avatar removed.");
    } catch {
      toast.error("Failed to remove avatar.");
    }
  }

  if (session.loading || !session.authenticated || !companyName) return null;

  const currentAvatar = avatarPreview ?? profile?.avatar_url ?? null;
  const currentName = profile?.display_name || session.user.email;

  return (
    <HeaderShell
      userName={currentName}
      companyName={companyName}
      onGoHome={() => router.push(`/company/${company}/dashboard`)}
      onGoProfile={() => { }}
      onResetPassword={() => router.push(`/company/${company}/reset-password`)}
      onLogout={handleLogout}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: "#f1f5f9" }}>
          Edit Profile
        </h1>

        {/* Avatar section */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 28,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* Avatar display */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Avatar"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #1e293b",
                }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#6366F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "white",
                  border: "3px solid #1e293b",
                }}
              >
                {currentName[0].toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>
              Profile Photo
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 14 }}>
              JPG, PNG, WebP or GIF. Max 5 MB recommended.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                style={{
                  background: "#6366F1",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: saving ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {saving ? "Uploading…" : "Upload Photo"}
              </button>
              {currentAvatar && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={saving}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.2)",
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Display name section */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 28,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 20 }}>
            Display Name
          </div>

          <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.6px" }}>
            Name shown in header
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="text"
              value={displayNameInput}
              onChange={e => setDisplayNameInput(e.target.value)}
              placeholder="Your display name"
              maxLength={150}
              style={{
                flex: 1,
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 14,
                color: "#e2e8f0",
                outline: "none",
              }}
            />
            <button
              onClick={handleSaveName}
              disabled={saving || displayNameInput === (profile?.display_name ?? "")}
              style={{
                background: "#6366F1",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                opacity: saving || displayNameInput === (profile?.display_name ?? "") ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Account info */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 28,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>
            Account Details
          </div>
          <ProfileField label="Email">{session.user.email}</ProfileField>
          <ProfileField label="Company">{companyName}</ProfileField>
          <ProfileField label="Role">{isAdmin ? "Admin" : "Member"}</ProfileField>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => router.push(`/company/${company}/reset-password`)}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
          <button
            onClick={() => router.push(`/company/${company}/dashboard`)}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </HeaderShell>
  );
}

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.6px" }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: "#e2e8f0" }}>{children}</div>
    </div>
  );
}
