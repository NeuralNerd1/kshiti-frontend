"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanyUsers } from "@/services/userService";

export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    getCompanyUsers()
      .then(() => {
        if (mounted) setAllowed(true);
      })
      .catch((err) => {
        if (!mounted) return;

        if (err?.status === 403) {
          router.replace("../dashboard");
        } else {
          router.replace("../dashboard");
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  if (allowed === null) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Verifying admin access…
      </div>
    );
  }

  return <>{children}</>;
}
