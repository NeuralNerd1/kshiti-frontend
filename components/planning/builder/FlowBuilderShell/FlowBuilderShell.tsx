"use client";

import React from "react";

type Props = {
  header: React.ReactNode;
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;

  /** Optional title shown centered above canvas */
  title?: string;
};

export default function FlowBuilderShell({
  header,
  left,
  center,
  right,
  title,
}: Props) {
  return (
    <div className="builder-root">
      {header}

      <div className="builder-body">
        <aside className="builder-left">
          {left}
        </aside>

        <main className="builder-center">
          {title && (
            <div className="builder-center-title">
              {title}
            </div>
          )}

          {center}
        </main>

        <aside className="builder-right">
          {right}
        </aside>
      </div>
    </div>
  );
}
