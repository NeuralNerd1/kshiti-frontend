"use client";

import { useEffect } from "react";
import { logout } from "@/services/authService";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await logout();
      router.replace("/company");
    }
    doLogout();
  }, [router]);

  return <Loader label="Logging out…" />;
}
