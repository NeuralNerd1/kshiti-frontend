"use client";

import { useState } from "react";
import { apiRequest } from "@/services/apiClient";

interface ProfileData {
    email: string;
    display_name: string;
    avatar_url: string | null;
}

interface UseProfileResult {
    profile: ProfileData | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    updateDisplayName: (name: string) => Promise<void>;
    uploadAvatar: (file: File) => Promise<void>;
    removeAvatar: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<ProfileData>("/auth/profile/", { method: "GET" });
            setProfile(data);
        } catch (e: any) {
            setError(e?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateDisplayName = async (name: string) => {
        setSaving(true);
        setError(null);
        try {
            const data = await apiRequest<ProfileData>("/auth/profile/", {
                method: "PATCH",
                body: JSON.stringify({ display_name: name }),
            });
            setProfile(prev => prev ? { ...prev, ...data } : data);
        } catch (e: any) {
            setError(e?.message || "Failed to update profile");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const uploadAvatar = async (file: File) => {
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const res = await fetch(`${API_BASE_URL}/auth/profile/avatar/`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Upload failed");
            }

            const data = await res.json();
            setProfile(prev => prev ? { ...prev, avatar_url: data.avatar_url } : null);
        } catch (e: any) {
            setError(e?.message || "Failed to upload avatar");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const removeAvatar = async () => {
        setSaving(true);
        setError(null);
        try {
            await apiRequest("/auth/profile/avatar/", { method: "DELETE" });
            setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
        } catch (e: any) {
            setError(e?.message || "Failed to remove avatar");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    return { profile, loading, saving, error, updateDisplayName, uploadAvatar, removeAvatar, refresh };
}
