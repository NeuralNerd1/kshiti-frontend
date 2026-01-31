"use client";

import { useCallback, useEffect, useState } from "react";
import { getCompanyUsers, addCompanyUser } from "@/services/userService";

type ApiError = {
  message: string;
  status: number;
};

type CompanyUser = {
  id: number;
  user_id: number;
  email: string;
  role_id: number;
  is_active: boolean;
};

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

export function useAdminUsers() {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCompanyUsers();
      setUsers(data);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err);
      } else {
        setError({
          message: "Unexpected error",
          status: 500,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCompanyUsers();
        if (!cancelled) {
          setUsers(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isApiError(err)) {
            setError(err);
          } else {
            setError({
              message: "Unexpected error",
              status: 500,
            });
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const addUser = async (payload: {
    user_id: number;
    role_id: number;
  }) => {
    return addCompanyUser(payload);
  };

  return {
    users,
    loading,
    error,
    refresh,
    addUser,
  };
}
