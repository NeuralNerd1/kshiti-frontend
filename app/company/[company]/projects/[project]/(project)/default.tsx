"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDefaultRedirect() {
  const router = useRouter();
  const { company, project } = useParams<{
    company: string;
    project: string;
  }>();

  useEffect(() => {
    router.replace(
      `/company/${company}/projects/${project}/overview`
    );
  }, [router, company, project]);

  return null;
}
