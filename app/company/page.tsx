"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompanyChooser from "@/components/auth/CompanyChooser";
import Loader from "@/components/common/Loader";
import { getCompanies } from "@/services/companyService";
import { pageStyles } from "@/styles/company/pageStyles";


export default function CompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<
    { name: string; slug: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      try {
        const list = await getCompanies();
        setCompanies(list);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loader label="Loading companies…" />;
  }

  return (
    <div style={pageStyles.container}>
      {/* LEFT — BRAND / IMAGE */}
      <div style={pageStyles.leftPane}>
        <div style={pageStyles.brandOverlay}>
          <h1 style={pageStyles.brandTitle}>
            Anyone Can Automate <span style={{ opacity: 0.8 }}>2.0</span>
          </h1>
          <p style={pageStyles.brandSubtitle}>
            Enterprise-ready automation platform
          </p>
        </div>
      </div>

      {/* RIGHT — COMPANY SELECTION */}
      <div style={pageStyles.rightPane}>
        <div style={pageStyles.card}>
          <h2 style={pageStyles.heading}>Select your company</h2>
          <p style={pageStyles.helper}>
            Start typing your company name to continue
          </p>

          <CompanyChooser
            companies={companies}
            onSelect={(slug: string) =>
  router.push(`/company/${slug}/login`)
}
          />
        </div>
      </div>
    </div>
  );
}
