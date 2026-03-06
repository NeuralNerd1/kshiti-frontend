"use client";

import { useState, useEffect } from "react";
import { listTestCases, getTestCaseDetail, TestCase } from "@/services/planning/testCaseService";
import { listTestCaseFolders } from "@/services/planning/testCaseFolderService";
import { listLocalTestCases, getLocalTestCaseDetail, LocalTestCase } from "@/services/planning/localTestCaseService";
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

export default function EditTestSuiteModal({
    projectId,
    suite,
    onClose,
    onSave,
    onGoToLocalTestCases,
}: {
    projectId: number;
    suite: {
        id: number;
        name: string;
        description?: string;
        tags?: string[];
        test_case_ids?: number[];
    };
    onClose: () => void;
    onSave: (data: {
        name: string;
        description?: string;
        tags?: string[];
        test_case_ids: number[];
    }) => Promise<void>;
    onGoToLocalTestCases: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(suite.name);
    const [description, setDescription] = useState(suite.description ?? "");
    const [tags, setTags] = useState<string[]>(suite.tags ?? []);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(suite.test_case_ids || []));
    const [viewingTestCase, setViewingTestCase] = useState<{ id: number, type: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Data
    const [globalFolders, setGlobalFolders] = useState<FolderNode[]>([]);
    const [globalCases, setGlobalCases] = useState<TestCase[]>([]);
    const [localFolders, setLocalFolders] = useState<FolderNode[]>([]);
    const [localCases, setLocalCases] = useState<LocalTestCase[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<"global" | "local">("global");

    useEffect(() => {
        if (!projectId) {
            setDataLoading(false);
            return;
        }

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
                console.error("Failed to load test cases for suite edit", err);
            } finally {
                setDataLoading(false);
            }
        }

        load();
    }, [projectId]);

    const toggleCase = (id: number) => {
        if (!isEditing) return; // Read-only mode
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await onSave({
                name,
                description,
                tags,
                test_case_ids: Array.from(selectedIds),
            });
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

    const getTestCaseType = (id: number) => {
        if (localCases.some(tc => tc.id === id)) return "LOCAL";
        if (globalCases.some(tc => tc.id === id)) return "GLOBAL";
        return "UNKNOWN";
    };

    const getTestCaseObj = (id: number) => {
        return localCases.find(tc => tc.id === id) || globalCases.find(tc => tc.id === id);
    };

    if (viewingTestCase) {
        return (
            <div className="modal-overlay">
                <div className="modal-card suite-modal-card">
                    <div className="suite-modal-header-row">
                        <h2>Test Case Detail</h2>
                        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => setViewingTestCase(null)}>
                            &larr; Back to Suite
                        </button>
                    </div>
                    <TestCaseDetailView
                        projectId={projectId}
                        testCaseId={viewingTestCase.id}
                        type={viewingTestCase.type}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card suite-modal-card">
                <div className="suite-modal-header-row">
                    <h2>{isEditing ? "Edit Test Suite" : "Test Suite Detail"}</h2>
                    {!isEditing && (
                        <button className="suite-edit-toggle-btn" onClick={() => setIsEditing(true)}>
                            Edit Suite
                        </button>
                    )}
                </div>

                <input
                    className="modal-input"
                    placeholder="Suite name"
                    value={name}
                    onChange={(e) => isEditing && setName(e.target.value)}
                    disabled={!isEditing}
                />

                <textarea
                    className="modal-textarea"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => isEditing && setDescription(e.target.value)}
                    disabled={!isEditing}
                />

                <div className="modal-field-group">
                    <label className="modal-field-label">Tags</label>
                    <TagsInput
                        value={tags}
                        onChange={isEditing ? setTags : () => { }}
                        placeholder={isEditing ? "Add tag and press Enter…" : ""}
                    // Note: TagsInput might need a disabled prop if it doesn't support read-only well
                    />
                </div>

                <div className="suite-tc-section">
                    <div className="suite-tc-header">
                        <span className="modal-field-label">
                            {isEditing ? "Select Test Cases" : "Included Test Cases"}
                        </span>
                        <button
                            className="suite-create-tc-btn"
                            onClick={onGoToLocalTestCases}
                        >
                            + Create Test Case
                        </button>
                    </div>

                    {isEditing ? (
                        <>
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
                                                isEditing={isEditing}
                                            />
                                        ))}

                                        {currentCases
                                            .filter((tc) => !tc.folder || !visibleFolderIds.has(tc.folder))
                                            .map((tc) => (
                                                <TestCaseRow
                                                    key={tc.id}
                                                    tc={tc}
                                                    selected={selectedIds.has(tc.id)}
                                                    onToggle={() => toggleCase(tc.id)}
                                                    level={0}
                                                    isEditing={isEditing}
                                                />
                                            ))}

                                        {currentFolders.length === 0 &&
                                            currentCases.length === 0 && (
                                                <div className="suite-tc-loading">No test cases available</div>
                                            )}
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="suite-tc-tree flat-list">
                            {dataLoading ? (
                                <div className="suite-tc-loading">Loading test cases...</div>
                            ) : Array.from(selectedIds).length === 0 ? (
                                <div className="suite-tc-loading">No test cases included</div>
                            ) : (
                                Array.from(selectedIds).map(id => {
                                    const tc = getTestCaseObj(id);
                                    if (!tc) return null;
                                    const type = getTestCaseType(id);
                                    return (
                                        <div key={id} className="suite-tc-row readonly flat-row">
                                            <div className="tc-flat-info">
                                                <div className="tc-flat-header">
                                                    <span className={`tc-badge ${type.toLowerCase()}`}>{type}</span>
                                                    <span className="suite-tc-name">{tc.name}</span>
                                                </div>
                                                {tc.description && (
                                                    <div className="suite-tc-desc">{tc.description}</div>
                                                )}
                                            </div>
                                            <button
                                                className="btn-view-details"
                                                onClick={() => setViewingTestCase({ id, type })}
                                            >
                                                View Details &rarr;
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

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
                        {isEditing ? "Cancel Edit" : "Close"}
                    </button>

                    {isEditing && (
                        <button
                            className="btn-primary"
                            disabled={!name.trim() || loading}
                            onClick={handleSave}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function FolderBranch({
    folder,
    cases,
    selectedIds,
    onToggle,
    level,
    isEditing,
}: {
    folder: FolderNode;
    cases: (TestCase | LocalTestCase)[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
    level: number;
    isEditing: boolean;
}) {
    const [expanded, setExpanded] = useState(true);
    const folderCases = cases.filter((tc) => tc.folder === folder.id);

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
                            isEditing={isEditing}
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
                            isEditing={isEditing}
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
    isEditing,
}: {
    tc: any;
    selected: boolean;
    onToggle: () => void;
    level: number;
    isEditing: boolean;
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
            className={`suite-tc-row ${selected ? "selected" : ""} ${!isEditing ? "readonly" : ""}`}
            style={{ paddingLeft: 12 + level * 20 + 22 }}
            onClick={isEditing ? onToggle : undefined}
        >
            <div className="suite-tc-checkbox-wrapper">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    disabled={!isEditing}
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

function TestCaseDetailView({ testCaseId, type }: { projectId: number, testCaseId: number, type: string }) {
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                if (type === "LOCAL") {
                    const data = await getLocalTestCaseDetail(testCaseId);
                    setDetail(data);
                } else {
                    const data = await getTestCaseDetail(testCaseId);
                    setDetail(data);
                }
            } catch (e) {
                console.error("Failed to load test case details", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [testCaseId, type]);

    if (loading) return <div className="suite-tc-loading">Loading details...</div>;
    if (!detail) return <div className="suite-tc-loading">Failed to load details.</div>;

    const versions = detail.versions || [];
    const latestVersion = versions.length > 0
        ? versions.reduce((max: any, v: any) => v.version_number > max.version_number ? v : max, versions[0])
        : null;

    const renderItem = (item: any, index?: number) => {
        let data = item;
        if (typeof item === 'string') {
            try {
                data = JSON.parse(item);
            } catch (e) {
                return <div className="tc-simple-item">{item}</div>;
            }
        }

        if (data?.action_key || data?.action || data?.actionKey) {
            const actionName = data.action_key || data.action || data.actionKey;
            const params = data.parameters || data.params || {};
            const notes = data.notes || data.execution_notes || data.description;
            const paramEntries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== "");

            return (
                <div className="tc-step-card">
                    <div className="tc-step-title">
                        {index !== undefined ? `${index + 1}. ` : ""}{actionName}
                    </div>
                    {notes && (
                        <div className="tc-step-notes">
                            {typeof notes === 'string' ? notes : JSON.stringify(notes)}
                        </div>
                    )}
                    {paramEntries.length > 0 && (
                        <div className="tc-step-params">
                            {paramEntries.map(([key, value]) => (
                                <div key={key} className="tc-step-param-row">
                                    <span className="param-key">{key}:</span>
                                    <span className="param-value">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (data?.description) return <div className="tc-simple-item">{data.description}</div>;
        if (data?.content) return <div className="tc-simple-item">{data.content}</div>;
        if (data?.text) return <div className="tc-simple-item">{data.text}</div>;
        return <div className="tc-simple-item">{JSON.stringify(data)}</div>;
    };

    return (
        <div className="tc-detail-container">
            <div className="tc-detail-header-block">
                <h3 className="tc-detail-title">{detail.test_case.name}</h3>
                {detail.test_case.description && <p className="tc-detail-desc">{detail.test_case.description}</p>}
            </div>

            {latestVersion ? (
                <div className="tc-detail-sections">
                    <div className="tc-detail-section">
                        <strong className="tc-section-title">Pre Conditions</strong>
                        <div className="tc-section-list">
                            {(latestVersion.pre_conditions_json || []).map((p: any, i: number) => <div key={i}>{renderItem(p, i)}</div>)}
                            {(!latestVersion.pre_conditions_json || latestVersion.pre_conditions_json.length === 0) && <div className="empty-li">None</div>}
                        </div>
                    </div>
                    <div className="tc-detail-section">
                        <strong className="tc-section-title">Steps</strong>
                        <div className="tc-section-list">
                            {(latestVersion.steps_json || []).map((s: any, i: number) => <div key={i}>{renderItem(s, i)}</div>)}
                            {(!latestVersion.steps_json || latestVersion.steps_json.length === 0) && <div className="empty-li">None</div>}
                        </div>
                    </div>
                    <div className="tc-detail-section">
                        <strong className="tc-section-title">Expected Outcomes</strong>
                        <div className="tc-section-list">
                            {(latestVersion.expected_outcomes_json || []).map((o: any, i: number) => <div key={i}>{renderItem(o, i)}</div>)}
                            {(!latestVersion.expected_outcomes_json || latestVersion.expected_outcomes_json.length === 0) && <div className="empty-li">None</div>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="suite-tc-loading">No versions created yet.</div>
            )}
        </div>
    );
}
