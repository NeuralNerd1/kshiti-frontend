"use client";

import { useRouter } from "next/navigation";

type Crumb = {
  label: string;
  href?: string; // last item can be non-clickable
};

export default function Breadcrumbs({
  items,
}: {
  items: Crumb[];
}) {
  const router = useRouter();

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        color: "#9CA3AF",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: item.href && !isLast ? "pointer" : "default",
              color:
                item.href && !isLast ? "#60A5FA" : "#9CA3AF",
            }}
            onClick={() => {
              if (item.href && !isLast) {
                router.push(item.href);
              }
            }}
          >
            {item.label}
            {!isLast && <span>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
