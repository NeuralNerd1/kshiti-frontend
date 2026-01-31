"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./useSession";

type Options = {
  requireAuth?: boolean;
  redirectTo?: string;
};

export function useAuthRedirect({
  requireAuth = false,
  redirectTo,
}: Options) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.loading) return;

    if (requireAuth && !session.authenticated && redirectTo) {
      router.replace(redirectTo);
    }
  }, [session.loading, session.authenticated, requireAuth, redirectTo, router]);

  return session;
}
