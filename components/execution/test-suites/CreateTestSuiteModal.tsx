"use client";

import { useState, useEffect } from "react";
import { createTestSuite } from "@/services/planning/testSuiteService";
import { listTestCases, TestCase } from "@/services/planning/testCaseService";
import { listTestCaseFolders } from "@/services/planning/testCaseFolderService";
import { listLocalTestCases, LocalTestCase } from "@/services/planning/localTestCaseService";
import { listLocalTestCaseFolders } from "@/services/planning/localTestCaseFolderService";
import TagsInput from "@/components/common/TagsInput";

import "./createTestSuiteModal.css";

type FolderNode = {
    id: number;
    name: string;
    parent: number | null;
    children: FolderNode[];
};

function buildTree(folders: { id: number; name: string; parent: number | null }[]): FolderNode[] {
    const map = new Map<number, FolderNode>();
    const roots: FolderNode[] = [];

    folders.forEach((f) => map.set(f.id, { ...f, children: [] }));

    folders.forEach((f) => {
        const node = map.get(f.id)!;
        if (f.parent) {
            const parent = map.get(f.parent);
            if (parent) parent.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

export default function CreateTestSuiteModal({
    projectId,
    onClose,
    onSuccess,
    onGoToLocalTestCases,
}: {
    projectId: number;
    onClose: () => void;
    onSuccess: (suite: any) => void;
    onGoToLocalTestCases: () => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    // Data
    const [globalFolders, setGlobalFolders] = useState<FolderNode[]>([]);
    const [globalCases, setGlobalCases] = useState<TestCase[]>([]);
    const [localFolders, setLocalFolders] = useState<FolderNode[]>([]);
    const [localCases, setLocalCases] = useState<LocalTestCase[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Tab: "global" or "local"
    const [activeTab, setActiveTab] = useState<"global" | "local">("global");

    useEffect(() => {
        async function load() {
            try {
                const [gFolders, gCases, lFolders, lCases] = await Promise.all([
                    listTestCaseFolders(projectId),
                    listTestCases(projectId),
                    listLocalTestCaseFolders(projectId),
                    listLocalTestCases(projectId),
                ]);

                setGlobalFolders(buildTree(gFolders));
                setGlobalCases(gCases);
                setLocalFolders(buildTree(lFolders));
                setLocalCases(lCases);
            } catch (err) {
                console.error("Failed to load test cases for suite", err);
            } finally {
                setDataLoading(false);
            }
        }

        load();
    }, [projectId]);

    const toggleCase = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);

            const created = await createTestSuite({
                project_id: projectId,
                name,
                description,
                tags,
                test_case_ids: Array.from(selectedIds),
            });

            onSuccess(created);
        } finally {
            setLoading(false);
        }
    };

    // --- HELPERS ---
    const getFolderIds = (nodes: FolderNode[]): number[] => {
        let ids: number[] = [];
        nodes.forEach(n => {
            ids.push(n.id);
            ids.push(...getFolderIds(n.children));
        });
        return ids;
    };

    const currentFolders = (activeTab === "global" ? globalFolders : localFolders).filter(f => (f as any).status !== 'ARCHIVED');
    const currentCases = (activeTab === "global" ? globalCases : localCases).filter(tc => (tc as any).status === 'SAVED');

    const visibleFolderIds = new Set(getFolderIds(currentFolders));

    return (
        <div className="modal-overlay">
            <div className="modal-card suite-modal-card">
                <h2>Create Test Suite</h2>

                <input
                    className="modal-input"
                    placeholder="Suite name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="modal-textarea"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Tags */}
                <div className="modal-field-group">
                    <label className="modal-field-label">Tags</label>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        placeholder="Add tag and press Enter…"
                    />
                </div>

                {/* Test Case Selection */}
                <div className="suite-tc-section">
                    <div className="suite-tc-header">
                        <span className="modal-field-label">Select Test Cases</span>
                        <button
                            className="suite-create-tc-btn"
                            onClick={onGoToLocalTestCases}
                        >
                            + Create Test Case
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="suite-tabs">
                        <button
                            className={`suite-tab ${activeTab === "global" ? "active" : ""}`}
                            onClick={() => setActiveTab("global")}
                        >
                            Global Test Cases
                        </button>
                        <button
                            className={`suite-tab ${activeTab === "local" ? "active" : ""}`}
                            onClick={() => setActiveTab("local")}
                        >
                            Local Test Cases
                        </button>
                    </div>

                    {/* Tree */}
                    <div className="suite-tc-tree">
                        {dataLoading ? (
                            <div className="suite-tc-loading">Loading test cases...</div>
                        ) : (
                            <>
                                {currentFolders.map((folder) => (
                                    <FolderBranch
                                        key={folder.id}
                                        folder={folder}
                                        cases={currentCases}
                                        selectedIds={selectedIds}
                                        onToggle={toggleCase}
                                        level={0}
                                    />
                                ))}

                                {/* Unfoldered test cases */}
                                {currentCases
                                    .filter((tc) => !tc.folder || !visibleFolderIds.has(tc.folder))
                                    .map((tc) => (
                                        <TestCaseRow
                                            key={tc.id}
                                            tc={tc}
                                            selected={selectedIds.has(tc.id)}
                                            onToggle={() => toggleCase(tc.id)}
                                            level={0}
                                        />
                                    ))}

                                {currentFolders.length === 0 &&
                                    currentCases.length === 0 && (
                                        <div className="suite-tc-loading">No test cases available</div>
                                    )}
                            </>
                        )}
                    </div>

                    {selectedIds.size > 0 && (
                        <div className="suite-selected-count">
                            {selectedIds.size} test case{selectedIds.size !== 1 ? "s" : ""} selected
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn-primary"
                        disabled={!name.trim() || loading}
                        onClick={handleCreate}
                    >
                        {loading ? "Creating..." : "Create Suite"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================================
   SUB-COMPONENTS
================================ */

function FolderBranch({
    folder,
    cases,
    selectedIds,
    onToggle,
    level,
}: {
    folder: FolderNode;
    cases: (TestCase | LocalTestCase)[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
    level: number;
}) {
    const [expanded, setExpanded] = useState(true);

    const folderCases = cases.filter(
        (tc) => tc.folder === folder.id
    );

    return (
        <div className="suite-folder-branch">
            <div
                className="suite-folder-row"
                style={{ paddingLeft: 12 + level * 20 }}
                onClick={() => setExpanded((v) => !v)}
            >
                <span className={`suite-folder-caret ${expanded ? 'expanded' : ''}`}>
                    {expanded ? "▾" : "▸"}
                </span>
                <span className="suite-folder-icon">📁</span>
                <span className="suite-folder-name">{folder.name}</span>
            </div>

            {expanded && (
                <div className="suite-folder-children">
                    {folderCases.map((tc) => (
                        <TestCaseRow
                            key={tc.id}
                            tc={tc}
                            selected={selectedIds.has(tc.id)}
                            onToggle={() => onToggle(tc.id)}
                            level={level + 1}
                        />
                    ))}

                    {folder.children.map((child) => (
                        <FolderBranch
                            key={child.id}
                            folder={child}
                            cases={cases}
                            selectedIds={selectedIds}
                            onToggle={onToggle}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TestCaseRow({
    tc,
    selected,
    onToggle,
    level,
}: {
    tc: any;
    selected: boolean;
    onToggle: () => void;
    level: number;
}) {
    let tagsList: string[] = [];
    if (tc.tags) {
        if (typeof tc.tags === 'string') {
            try { tagsList = JSON.parse(tc.tags); } catch { tagsList = []; }
        } else if (Array.isArray(tc.tags)) {
            tagsList = tc.tags;
        }
    }

    const nameToDisplay = tc.name || tc.title || tc.case_name || tc.label || (tc.id ? `Case #${tc.id}` : "Unknown Case");

    return (
        <div
            className={`suite-tc-row ${selected ? "selected" : ""}`}
            style={{ paddingLeft: 12 + level * 20 + 22 }}
            onClick={onToggle}
        >
            <div className="suite-tc-checkbox-wrapper">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    className="suite-tc-checkbox"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            <span className="suite-tc-name">
                {nameToDisplay}
            </span>
            {tagsList.length > 0 && (
                <div className="suite-tc-tags">
                    {tagsList.slice(0, 1).map((tag: string) => (
                        <span key={tag} className="tc-tag-chip">{tag}</span>
                    ))}
                    {tagsList.length > 1 && (
                        <span className="tc-tag-more">+{tagsList.length - 1}</span>
                    )}
                </div>
            )}
        </div>
    );
}

