"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import FolderExplorer from "@/components/planning/FolderExplorer/FolderExplorer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchInput from "@/components/common/datatable/SearchInput";
import StatusFilter from "@/components/common/datatable/StatusFilter";
import { toast } from "@/components/common/toast/toast";

import { useProject } from "@/hooks/projects/useProject";
import { useLocalTestCases } from "@/hooks/planning/useLocalTestCases";
import { useLocalTestCaseFolders } from "@/hooks/planning/useLocalTestCaseFolders";

import {
    archiveLocalTestCase,
    updateLocalTestCase,
} from "@/services/planning/localTestCaseService";

import CreateLocalTestCaseModal from "@/components/execution/local-test-cases/CreateLocalTestCaseModal";
import EditLocalTestCaseModal from "@/components/execution/local-test-cases/EditLocalTestCaseModal";
import LocalTestCaseCard from "@/components/execution/local-test-cases/LocalTestCaseCard";

import "./localTestCasesPage.css";

/* --------------------------------
   STATUS OPTIONS
--------------------------------- */
const testCaseStatusOptions = [
    { label: "All", value: "ALL" },
    { label: "Draft", value: "DRAFT" },
    { label: "Saved", value: "SAVED" },
    { label: "Archived", value: "ARCHIVED" },
];

export default function LocalTestCasesPage() {
    const { project, loading: projectLoading } = useProject();
    const projectId = project?.id ?? null;

    const router = useRouter();
    const params = useParams();

    const company = params.company as string;
    const projectSlug = params.project as string;

    /* --------------------------------
       UI STATE
    --------------------------------- */
    const [selectedFolderId, setSelectedFolderId] =
        useState<string>("all");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    const [showCreate, setShowCreate] = useState(false);
    const [editTestCase, setEditTestCase] =
        useState<any>(null);

    /* --------------------------------
       LOCAL TEST CASE FOLDERS
    --------------------------------- */
    const {
        folders,
        canCreate: canCreateFolder,
        canEdit: canEditFolder,
        createFolder,
        renameFolder,
        deleteFolder,
    } = useLocalTestCaseFolders(projectId ?? undefined);

    /* --------------------------------
       DERIVED
    --------------------------------- */
    const folderId =
        selectedFolderId === "all"
            ? undefined
            : Number(selectedFolderId);

    const {
        testCases,
        loading,
        canCreate,
        setTestCases,
    } = useLocalTestCases(projectId, folderId);

    if (projectLoading || !projectId) return null;

    /* --------------------------------
       FILTER
    --------------------------------- */
    const filtered = testCases.filter((tc) => {
        if (status !== "ALL" && tc.status !== status)
            return false;

        if (
            search &&
            !tc.name.toLowerCase().includes(search.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <div className="testcases-root">
            {/* LEFT */}
            <aside className="testcases-sidebar">
                <FolderExplorer
                    folders={folders}
                    activeId={selectedFolderId}
                    onSelect={setSelectedFolderId}
                    rootLabel="All Local Test Cases"
                    canCreate={canCreateFolder}
                    canEdit={canEditFolder}
                    onCreate={createFolder}
                    onRename={renameFolder}
                    onDelete={deleteFolder}
                />
            </aside>

            {/* RIGHT */}
            <main className="testcases-content">
                {/* HEADER */}
                <div className="flows-page-header">
                    <Breadcrumbs
                        items={[
                            { label: "Overview", href: "../overview" },
                            { label: "Local Test Cases" },
                        ]}
                    />

                    <h1 className="flows-title">
                        Local Test Cases
                    </h1>

                    <div className="flows-toolbar-row">
                        <div className="flows-toolbar-left">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search local test cases"
                            />

                            <StatusFilter
                                value={status}
                                onChange={setStatus}
                                options={testCaseStatusOptions}
                            />
                        </div>

                        {canCreate && (
                            <button
                                className="create-flow-btn"
                                onClick={() => setShowCreate(true)}
                            >
                                + Create test case
                            </button>
                        )}
                    </div>
                </div>

                {/* GRID */}
                {loading ? (
                    <div className="flows-empty">
                        Loading local test cases...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flows-empty">
                        No local test cases found
                    </div>
                ) : (
                    <div className="flows-grid">
                        {filtered.map((tc) => (
                            <LocalTestCaseCard
                                key={tc.id}
                                testCase={tc}
                                onOpen={() =>
                                    router.push(
                                        `/company/${company}/projects/${projectSlug}/execution/local-test-cases/${tc.id}/builder`
                                    )
                                }
                                onEdit={() => setEditTestCase(tc)}
                                onArchive={async () => {
                                    try {
                                        await archiveLocalTestCase(tc.id);
                                        // Update local state instead of filtering out
                                        setTestCases((prev) =>
                                            prev.map((x) =>
                                                x.id === tc.id ? { ...x, status: "ARCHIVED" } : x
                                            )
                                        );
                                        toast.success(
                                            "Local test case archived"
                                        );
                                    } catch {
                                        toast.error(
                                            "Failed to archive local test case"
                                        );
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* CREATE */}
            {showCreate && folderId && (
                <CreateLocalTestCaseModal
                    folderId={folderId}
                    onClose={() => setShowCreate(false)}
                    onSuccess={(newTestCase) => {
                        setTestCases((prev) => [
                            newTestCase,
                            ...prev,
                        ]);
                        toast.success("Local test case created");
                        setShowCreate(false);
                    }}
                />
            )}

            {/* EDIT */}
            {editTestCase && (
                <EditLocalTestCaseModal
                    testCase={editTestCase}
                    onClose={() => setEditTestCase(null)}
                    onSave={async (data) => {
                        const updated = await updateLocalTestCase(
                            editTestCase.id,
                            data
                        );

                        setTestCases((prev) =>
                            prev.map((tc) =>
                                tc.id === updated.id
                                    ? updated
                                    : tc
                            )
                        );

                        toast.success("Local test case updated");
                        setEditTestCase(null);
                    }}
                />
            )}
        </div>
    );
}
