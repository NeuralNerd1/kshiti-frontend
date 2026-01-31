"use client";

import { useState } from "react";
import HeaderDropdown from "./HeaderDropdown";

export default function HeaderUserCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="header-user">
      <div
        className="header-user__card"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="header-user__avatar">
          U
        </div>

        <div className="header-user__info">
          <div className="header-user__name">
            User Name
          </div>
          <div className="header-user__email">
            user@company.com
          </div>
        </div>

        <div className="header-user__caret">▾</div>
      </div>

      {open && (
        <HeaderDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
