"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCompanyUsers } from "@/services/userService";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { company } = useParams<{ company: string }>();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 🔑 Permission probe (admin-only API)
        await getCompanyUsers();
        if (!cancelled) setAllowed(true);
      } catch (err: any) {
        if (!cancelled) {
          // 🚫 Not admin or forbidden → back to dashboard
          router.replace(`/company/${company}/dashboard`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, company]);

  if (allowed === null) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Verifying admin access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
