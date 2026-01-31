import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo-placeholder">
          LOGO
        </div>
      </div>

      <div className="sidebar__nav">
        <SidebarItem label="Home" active />
        <SidebarItem label="Projects" />
        <SidebarItem label="Settings" disabled />
      </div>
    </nav>
  );
}
