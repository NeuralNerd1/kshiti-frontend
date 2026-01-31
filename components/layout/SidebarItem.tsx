type SidebarItemProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
};

export default function SidebarItem({
  label,
  active,
  disabled,
}: SidebarItemProps) {
  return (
    <div
      className={[
        "sidebar-item",
        active ? "sidebar-item--active" : "",
        disabled ? "sidebar-item--disabled" : "",
      ].join(" ")}
    >
      <span className="sidebar-item__label">
        {label}
      </span>
    </div>
  );
}
