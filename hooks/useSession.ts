"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/services/authService";

type SessionState =
  | {
    loading: true;
    authenticated: false;
    user?: undefined;
    company?: undefined;
    error?: undefined;
  }
  | {
    loading: false;
    authenticated: true;
    user: {
      id: number;
      email: string;
      display_name: string;
      avatar_url: string | null;
    };
    company: {
      id: number;
      slug: string;
    };
    error?: undefined;
  }
  | {
    loading: false;
    authenticated: false;
    user?: undefined;
    company?: undefined;
    error?: string;
  };

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("access_token");
    if (!token) {
      setState({
        loading: false,
        authenticated: false,
      });
      return;
    }

    async function fetchSession() {
      try {
        const res = await getSession();

        if (!active) return;

        if (res.authenticated) {
          setState({
            loading: false,
            authenticated: true,
            user: {
              id: res.user_id,
              email: res.email,
              display_name: res.display_name ?? res.email,
              avatar_url: res.avatar_url ?? null,
            },
            company: {
              id: res.company_id,
              slug: res.company_slug,
            },
          });
        } else {
          setState({
            loading: false,
            authenticated: false,
          });
        }
      } catch (err: any) {
        if (!active) return;

        setState({
          loading: false,
          authenticated: false,
          error: err.message || "Session check failed",
        });
      }
    }

    fetchSession();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
