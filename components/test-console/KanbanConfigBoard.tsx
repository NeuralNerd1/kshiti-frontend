"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { kanbanService, KanbanBoardConfig } from "@/services/test-plan/kanbanService";
import { toast } from "@/components/common/toast/toast";
import "@/styles/test-console/kanbanConfig.css";

interface KanbanConfigBoardProps {
    projectId: number;
    viewKey?: string; // Phase 3: Support individual view keys
}

const SAMPLE_CARDS = [
    { id: "TP-101", title: "Implement Real-time Synchronization", status: "TO DO", priority: "High", owner: "AL", color: "#f87171", section: "Sprint 1" },
    { id: "TP-102", title: "Refactor Authentication Middleware", status: "IN PROGRESS", priority: "Critical", owner: "BK", color: "#c084fc", section: "Sprint 1" },
    { id: "TP-103", title: "API Documentation Polish", status: "REVIEW", priority: "Medium", owner: "AL", color: "#60a5fa", section: "Epic: Auth" },
    { id: "TP-104", title: "Fix Mobile Navigation Glitch", status: "DONE", priority: "Low", owner: "SY", color: "#4ade80", section: "Sprint 2" },
    { id: "TP-105", title: "Database Migration Scripts", status: "TO DO", priority: "High", owner: "BK", color: "#f87171", section: "Epic: Infra" },
    { id: "TP-106", title: "Unit Tests for Payment Flow", status: "IN PROGRESS", priority: "Medium", owner: "SY", color: "#60a5fa", section: "Epic: Auth" },
    { id: "TP-107", title: "Optimize Image Processing Engine", status: "TO DO", priority: "Critical", owner: "AL", color: "#c084fc", section: "Sprint 1" },
    { id: "TP-108", title: "Cleanup Legacy CSS Modules", status: "REVIEW", priority: "Low", owner: "BK", color: "#4ade80", section: "Sprint 2" },
    { id: "TP-109", title: "Verify Webhook Notifications", status: "IN PROGRESS", priority: "High", owner: "SY", color: "#f87171", section: "Epic: Infra" },
];

const COLUMNS = ["TO DO", "IN PROGRESS", "REVIEW", "DONE"];

export default function KanbanConfigBoard({ projectId, viewKey = "GLOBAL" }: KanbanConfigBoardProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Phase 3: Toggleable sidebar
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
        if (config.swimlane_attribute === "NONE") return [{ id: "ALL", label: "Project Board" }];

        if (config.swimlane_attribute === "OWNER") {
            const owners = Array.from(new Set(cards.map(c => c.owner)));
            return owners.map(o => ({ id: o, label: `Assignee: ${o}` }));
        }

        if (config.swimlane_attribute === "PRIORITY") {
            return [
                { id: "Critical", label: "🔴 Critical Priority" },
                { id: "High", label: "🟠 High Priority" },
                { id: "Medium", label: "🔵 Medium Priority" },
                { id: "Low", label: "⚪ Low Priority" },
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
            toast.success(`Kanban Setup saved for ${viewKey === "GLOBAL" ? "Project" : "View"}!`);
        } catch (e: any) {
            toast.error(e?.message || "Failed to persist configuration");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-state">Initialising Kanban Setup...</div>;

    const rootClasses = [
        "kanban-config-root",
        `theme-${config.color_scheme.toLowerCase().replace("_", "-")}`,
        `layout-${config.layout_type.toLowerCase().replace("_", "-")}`,
        `density-${config.card_density.toLowerCase()}`,
        config.enable_glass ? "glass-effect" : "",
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
    ].join(" ");

    return (
        <div className={rootClasses}>
            {/* 🚀 WORKSPACE AREA */}
            <div className="kanban-board-workspace">
                {/* PHASE 3: SIDEBAR TOGGLE BUTTON */}
                <button
                    className="kanban-sidebar-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? "Hide Settings" : "Show Settings"}
                >
                    {sidebarOpen ? "→" : "⚙️"}
                </button>

                <div
                    className="kanban-board-preview"
                    style={{ transform: `scale(${config.zoom_level / 100})` }}
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

                                <div style={{ display: "flex", gap: "20px" }}>
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
                                                            style={{
                                                                borderLeft: `4px solid ${card.color}`,
                                                                boxShadow: config.color_scheme === "MODERN" ? `0 4px 20px ${card.color}15` : ""
                                                            }}
                                                        >
                                                            <span className="kanban-card-id">{card.id}</span>
                                                            <div className="kanban-card-title">{card.title}</div>
                                                            <div className="kanban-card-footer">
                                                                {config.show_owner && (
                                                                    <div className="kanban-card-owner">
                                                                        <div className="kanban-owner-avatar" style={{ background: card.color }}>
                                                                            {card.owner}
                                                                        </div>
                                                                        <span style={{ fontSize: "11px", color: "#64748b" }}>24 Oct</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
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

            {/* ⚙️ KANBAN SETUP SIDEBAR */}
            <aside className="design-studio-sidebar">
                <div className="studio-header">
                    <h2 className="studio-title">⚙️ Kanban Setup</h2>
                    <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Viewing: {viewKey}
                    </span>
                </div>

                <div className="studio-content">
                    {/* SECTION: GROUPING (Phase 3: Visual Selection) */}
                    <div className="studio-section">
                        <label className="studio-section-label">Group items by</label>
                        <div className="visual-selector-grid">
                            {[
                                { id: "NONE", label: "Flat List", icon: "📄" },
                                { id: "OWNER", label: "Assignee", icon: "👤" },
                                { id: "PRIORITY", label: "Priority", icon: "⭐" },
                                { id: "SECTION", label: "Section", icon: "📁" },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    className={`visual-selector-btn ${config.swimlane_attribute === opt.id ? "active" : ""}`}
                                    onClick={() => setConfig({ ...config, swimlane_attribute: opt.id as any })}
                                >
                                    <span className="opt-icon">{opt.icon}</span>
                                    <span className="opt-label">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: AESTHETICS */}
                    <div className="studio-section">
                        <label className="studio-section-label">Aesthetics & Effects</label>
                        <div className="studio-control-group">
                            <div className="option-grid">
                                {["MODERN", "CLASSIC", "HIGH_CONTRAST"].map(theme => (
                                    <button
                                        key={theme}
                                        className={`studio-btn ${config.color_scheme === theme ? "active" : ""}`}
                                        onClick={() => setConfig({ ...config, color_scheme: theme as any })}
                                    >
                                        {theme.replace("_", " ")}
                                    </button>
                                ))}
                            </div>

                            <label className="studio-toggle">
                                <span className="config-option-label" style={{ fontSize: "13px" }}>Glassmorphism Blur</span>
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

                    {/* SECTION: DENSITY & ZOOM */}
                    <div className="studio-section">
                        <label className="studio-section-label">Density & Zoom</label>
                        <div className="studio-control-group">
                            <div className="option-grid">
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

                            <div className="zoom-control-container">
                                <span style={{ fontSize: "16px" }}>🔍</span>
                                <input
                                    type="range"
                                    className="zoom-slider"
                                    min="60"
                                    max="120"
                                    step="10"
                                    value={config.zoom_level}
                                    onChange={(e) => setConfig({ ...config, zoom_level: parseInt(e.target.value) })}
                                />
                                <span style={{ minWidth: "40px", fontSize: "12px", color: "#94a3b8" }}>{config.zoom_level}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="studio-footer">
                    <button
                        className="apply-config-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Persisting Setup..." : `Apply to ${viewKey === "GLOBAL" ? "Project" : "View"}`}
                    </button>
                </div>
            </aside>
        </div>
    );
}
