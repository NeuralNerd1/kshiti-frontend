"use client";

import { useState, useEffect, useMemo } from "react";
import { kanbanService, KanbanBoardConfig } from "@/services/test-plan/kanbanService";
import { toast } from "@/components/common/toast/toast";
import "@/styles/test-console/kanbanConfig.css";

interface KanbanConfigBoardProps {
    projectId: number;
    viewKey?: string;
}

const SAMPLE_CARDS = [
    { id: "TP-101", title: "Implement Real-time Synchronization", status: "TO DO", priority: "High", owner: "AL", color: "#818CF8", section: "Sprint 1" },
    { id: "TP-102", title: "Refactor Authentication Middleware", status: "IN PROGRESS", priority: "Critical", owner: "BK", color: "#C084FC", section: "Sprint 1" },
    { id: "TP-103", title: "API Documentation Polish", status: "REVIEW", priority: "Medium", owner: "AL", color: "#60A5FA", section: "Epic: Auth" },
    { id: "TP-104", title: "Fix Mobile Navigation Glitch", status: "DONE", priority: "Low", owner: "SY", color: "#34D399", section: "Sprint 2" },
    { id: "TP-105", title: "Database Migration Scripts", status: "TO DO", priority: "High", owner: "BK", color: "#818CF8", section: "Epic: Infra" },
    { id: "TP-106", title: "Unit Tests for Payment Flow", status: "IN PROGRESS", priority: "Medium", owner: "SY", color: "#60A5FA", section: "Epic: Auth" },
    { id: "TP-107", title: "Optimize Image Processing Engine", status: "TO DO", priority: "Critical", owner: "AL", color: "#C084FC", section: "Sprint 1" },
    { id: "TP-108", title: "Cleanup Legacy CSS Modules", status: "REVIEW", priority: "Low", owner: "BK", color: "#34D399", section: "Sprint 2" },
    { id: "TP-109", title: "Verify Webhook Notifications", status: "IN PROGRESS", priority: "High", owner: "SY", color: "#818CF8", section: "Epic: Infra" },
];

const COLUMNS = ["TO DO", "IN PROGRESS", "REVIEW", "DONE"];

const COLUMN_ACCENT: Record<string, string> = {
    "TO DO": "#475569",
    "IN PROGRESS": "#818CF8",
    "REVIEW": "#F59E0B",
    "DONE": "#34D399",
};

const GROUPING_OPTIONS = [
    { id: "NONE", label: "Flat List" },
    { id: "OWNER", label: "Assignee" },
    { id: "PRIORITY", label: "Priority" },
    { id: "SECTION", label: "Section" },
];

export default function KanbanConfigBoard({ projectId, viewKey = "GLOBAL" }: KanbanConfigBoardProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [cards, setCards] = useState(SAMPLE_CARDS);

    const [config, setConfig] = useState<KanbanBoardConfig>({
        project: projectId,
        view_key: viewKey,
        layout_type: "STANDARD",
        color_scheme: "MODERN",
        card_density: "COMFORTABLE",
        swimlane_attribute: "NONE",
        zoom_level: 100,
        enable_glass: true,
        custom_accent_color: "#7c5cff",
        show_owner: true,
        show_due_date: true,
        columns_config: {},
    });

    useEffect(() => {
        async function loadConfig() {
            try {
                const data = await kanbanService.getConfig(projectId, viewKey);
                if (data) setConfig(data);
            } catch (e) {
                console.error("Failed to load kanban config", e);
            } finally {
                setLoading(false);
            }
        }
        loadConfig();
    }, [projectId, viewKey]);

    // --- SWIMLANE LOGIC ---
    const swimlanes = useMemo(() => {
        if (config.swimlane_attribute === "NONE") return [{ id: "ALL", label: "" }];
        if (config.swimlane_attribute === "OWNER") {
            const owners = Array.from(new Set(cards.map(c => c.owner)));
            return owners.map(o => ({ id: o, label: `Assignee: ${o}` }));
        }
        if (config.swimlane_attribute === "PRIORITY") {
            return [
                { id: "Critical", label: "Critical" },
                { id: "High", label: "High" },
                { id: "Medium", label: "Medium" },
                { id: "Low", label: "Low" },
            ];
        }
        if (config.swimlane_attribute === "SECTION") {
            const sections = Array.from(new Set(cards.map(c => c.section)));
            return sections.map(s => ({ id: s, label: s }));
        }
        return [];
    }, [config.swimlane_attribute, cards]);

    // --- DRAG & DROP ---
    const handleDragStart = (e: React.DragEvent, cardId: string) => {
        e.dataTransfer.setData("cardId", cardId);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (e: React.DragEvent, newStatus: string, swimlaneId: string) => {
        const cardId = e.dataTransfer.getData("cardId");
        setCards(prev => prev.map(c => {
            if (c.id !== cardId) return c;
            const updated = { ...c, status: newStatus };
            if (config.swimlane_attribute === "OWNER") updated.owner = swimlaneId;
            if (config.swimlane_attribute === "PRIORITY") updated.priority = swimlaneId;
            if (config.swimlane_attribute === "SECTION") updated.section = swimlaneId;
            return updated;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await kanbanService.updateConfig(projectId, { ...config, view_key: viewKey });
            toast.success(`Kanban config saved for ${viewKey === "GLOBAL" ? "project" : "view"}.`);
        } catch (e: any) {
            toast.error(e?.message || "Failed to save configuration");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="kanban-loading-state">Loading Kanban Setup…</div>;

    const rootClasses = [
        "kanban-config-root",
        `theme-${config.color_scheme.toLowerCase().replace("_", "-")}`,
        `layout-${config.layout_type.toLowerCase().replace("_", "-")}`,
        `density-${config.card_density.toLowerCase()}`,
        config.enable_glass ? "glass-effect" : "",
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden",
    ].filter(Boolean).join(" ");

    return (
        <div className={rootClasses}>
            {/* BOARD WORKSPACE */}
            <div className="kanban-board-workspace">

                {/* Sidebar toggle — inside workspace, top-left */}
                <div className="kanban-toolbar">
                    <button
                        className="kanban-sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? "Hide Settings" : "Show Settings"}
                    >
                        {sidebarOpen ? "Hide Settings" : "Settings"}
                    </button>
                    <span className="kanban-view-label">
                        Viewing: <strong>{viewKey}</strong>
                    </span>
                </div>

                {/* Board scroll wrapper */}
                <div className="kanban-board-scroll">
                    <div
                        className="kanban-board-preview"
                        style={{ zoom: config.zoom_level / 100 }}
                    >
                        <div className="kanban-swimlane-container">
                            {swimlanes.map(lane => (
                                <div key={lane.id} className="kanban-swimlane">
                                    {config.swimlane_attribute !== "NONE" && (
                                        <div className="kanban-swimlane-header">
                                            <span className="kanban-swimlane-title">{lane.label}</span>
                                            <div className="kanban-swimlane-line" />
                                        </div>
                                    )}

                                    <div className="kanban-columns-row">
                                        {COLUMNS.map(col => {
                                            const columnCards = cards.filter(c => {
                                                const matchesStatus = c.status === col;
                                                if (config.swimlane_attribute === "NONE") return matchesStatus;
                                                if (config.swimlane_attribute === "OWNER") return matchesStatus && c.owner === lane.id;
                                                if (config.swimlane_attribute === "PRIORITY") return matchesStatus && c.priority === lane.id;
                                                if (config.swimlane_attribute === "SECTION") return matchesStatus && c.section === lane.id;
                                                return false;
                                            });

                                            return (
                                                <div
                                                    key={`${lane.id}-${col}`}
                                                    className="kanban-column"
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, col, lane.id)}
                                                >
                                                    <div className="kanban-column-header">
                                                        <div
                                                            className="kanban-column-indicator"
                                                            style={{ background: COLUMN_ACCENT[col] }}
                                                        />
                                                        <span className="kanban-column-title">{col}</span>
                                                        <span className="kanban-column-count">{columnCards.length}</span>
                                                    </div>

                                                    <div className="kanban-cards-list">
                                                        {columnCards.map(card => (
                                                            <div
                                                                key={card.id}
                                                                className="kanban-preview-card"
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, card.id)}
                                                                style={{ borderLeft: `3px solid ${card.color}` }}
                                                            >
                                                                <span className="kanban-card-id">{card.id}</span>
                                                                <div className="kanban-card-title">{card.title}</div>
                                                                <div className="kanban-card-footer">
                                                                    {config.show_owner && (
                                                                        <div className="kanban-card-owner">
                                                                            <div
                                                                                className="kanban-owner-avatar"
                                                                                style={{ background: card.color }}
                                                                            >
                                                                                {card.owner}
                                                                            </div>
                                                                            <span className="kanban-card-date">24 Oct</span>
                                                                        </div>
                                                                    )}
                                                                    <span
                                                                        className="kanban-card-priority"
                                                                        data-priority={card.priority.toLowerCase()}
                                                                    >
                                                                        {card.priority}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {columnCards.length === 0 && (
                                                            <div className="kanban-empty-column">
                                                                Drop here
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SETTINGS SIDEBAR */}
            <aside className="design-studio-sidebar">
                <div className="studio-header">
                    <h2 className="studio-title">Kanban Setup</h2>
                </div>

                <div className="studio-content">
                    {/* Group by */}
                    <div className="studio-section">
                        <label className="studio-section-label">Group Items By</label>
                        <div className="visual-selector-grid">
                            {GROUPING_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`visual-selector-btn ${config.swimlane_attribute === opt.id ? "active" : ""}`}
                                    onClick={() => setConfig({ ...config, swimlane_attribute: opt.id as any })}
                                >
                                    <span className="opt-label">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Aesthetics */}
                    <div className="studio-section">
                        <label className="studio-section-label">Aesthetics</label>
                        <div className="studio-control-group">
                            <div className="option-grid option-grid--3">
                                {["MODERN", "CLASSIC", "HIGH_CONTRAST"].map(theme => (
                                    <button
                                        key={theme}
                                        className={`studio-btn ${config.color_scheme === theme ? "active" : ""}`}
                                        onClick={() => setConfig({ ...config, color_scheme: theme as any })}
                                    >
                                        {theme === "HIGH_CONTRAST" ? "High Contrast" : theme.charAt(0) + theme.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>

                            <label className="studio-toggle">
                                <span className="config-option-label">Glassmorphism</span>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={config.enable_glass}
                                    onChange={(e) => setConfig({ ...config, enable_glass: e.target.checked })}
                                />
                                <div className="studio-toggle-inner">
                                    <div className="studio-toggle-pill" />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Density */}
                    <div className="studio-section">
                        <label className="studio-section-label">Card Density</label>
                        <div className="option-grid option-grid--3">
                            {["COMPACT", "COMFORTABLE", "SPACIOUS"].map(d => (
                                <button
                                    key={d}
                                    className={`studio-btn ${config.card_density === d ? "active" : ""}`}
                                    onClick={() => setConfig({ ...config, card_density: d as any })}
                                >
                                    {d.charAt(0) + d.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zoom */}
                    <div className="studio-section">
                        <label className="studio-section-label">
                            Zoom — {config.zoom_level}%
                        </label>
                        <div className="zoom-control-container">
                            <span className="zoom-label">60%</span>
                            <input
                                type="range"
                                className="zoom-slider"
                                min="60"
                                max="120"
                                step="10"
                                value={config.zoom_level}
                                onChange={(e) => setConfig({ ...config, zoom_level: parseInt(e.target.value) })}
                            />
                            <span className="zoom-label">120%</span>
                        </div>
                    </div>

                    {/* Card Display */}
                    <div className="studio-section">
                        <label className="studio-section-label">Show on Cards</label>
                        <div className="studio-control-group">
                            <label className="studio-toggle">
                                <span className="config-option-label">Owner Avatar</span>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={config.show_owner}
                                    onChange={(e) => setConfig({ ...config, show_owner: e.target.checked })}
                                />
                                <div className="studio-toggle-inner">
                                    <div className="studio-toggle-pill" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="studio-footer">
                    <button
                        className="apply-config-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving…" : `Apply to ${viewKey === "GLOBAL" ? "Project" : "View"}`}
                    </button>
                </div>
            </aside>
        </div>
    );
}
