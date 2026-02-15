"use client";

import "@/styles/test-console/testConsoleSidebar.css";

type SidebarItem = {
    id: string;
    label: string;
};

const sidebarItems: SidebarItem[] = [
    { id: "templates", label: "Test Planning Template" },
];

export default function TestConsoleSidebar({
    activeId,
    onSelect,
}: {
    activeId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="test-console-sidebar">
            <div className="sidebar-header">
                <span className="sidebar-title">Test Console</span>
            </div>

            <nav className="sidebar-nav">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
                        onClick={() => onSelect(item.id)}
                    >
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
