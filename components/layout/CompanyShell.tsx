"use client";

import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

type CompanyShellProps = {
  children: React.ReactNode;
};

export default function CompanyShell({ children }: CompanyShellProps) {
  return (
    <div className="company-shell">
      <aside className="company-shell__sidebar">
        <Sidebar />
      </aside>

      <div className="company-shell__main">
        <header className="company-shell__header">
          <TopHeader />
        </header>

        <main className="company-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}
