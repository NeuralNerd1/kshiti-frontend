"use client";

import { ReactNode } from "react";

type SessionGateProps = {
  isAuthenticated: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function SessionGate({
  isAuthenticated,
  children,
  fallback = null,
}: SessionGateProps) {
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
