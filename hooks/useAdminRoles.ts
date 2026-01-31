"use client";

import { useEffect, useState } from "react";
import { getCompanyRoles } from "@/services/roleService";

type Role = {
  id: number;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions_json: Record<string, boolean>;
};

export function useAdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<
    { message: string; status: number } | null
  >(null);

  useEffect(() => {
    getCompanyRoles()
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    roles,
    loading,
    error,
  };
}
