"use client";

import { useEffect, useState } from "react";
import { getCompanies, Company } from "@/services/companyService";

export function useCompanyName(
  companyParam: string | string[] | undefined
) {
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    console.log("[useCompanyName] raw param:", companyParam);

    if (!companyParam) {
      console.warn("[useCompanyName] companyParam missing");
      return;
    }

    const slug = Array.isArray(companyParam)
      ? companyParam[0]
      : companyParam;

    console.log("[useCompanyName] resolved slug:", slug);

    let cancelled = false;

    (async () => {
      try {
        const companies: Company[] = await getCompanies();

        console.log(
          "[useCompanyName] companies from API:",
          companies
        );

        const match = companies.find(
          (c) => c.slug === slug
        );

        console.log(
          "[useCompanyName] matched company:",
          match
        );

        if (!cancelled && match) {
          console.log(
            "[useCompanyName] setting companyName:",
            match.name
          );
          setCompanyName(match.name);
        } else {
          console.warn(
            "[useCompanyName] NO MATCH for slug:",
            slug
          );
        }
      } catch (err) {
        console.error(
          "[useCompanyName] failed to fetch companies",
          err
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyParam]);

  return companyName;
}
