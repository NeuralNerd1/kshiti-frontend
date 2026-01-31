export type SidebarItemConfig = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function getSidebarItems(company: string) {
  return [
    {
      label: "Dashboard",
      href: `/company/${company}/dashboard`,
    },
    {
      label: "Projects",
      href: `/company/${company}/projects`,
    },
    {
      label: "Settings",
      href: "#",
      disabled: true,
    },
  ];
}

