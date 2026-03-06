"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchInput from "@/components/common/datatable/SearchInput";
import StatusFilter from "@/components/common/datatable/StatusFilter";
import { toast } from "@/components/common/toast/toast";

import { useProject } from "@/hooks/projects/useProject";
import { useTestSuites } from "@/hooks/planning/useTestSuites";

import {
    updateTestSuite,
    deleteTestSuite,
} from "@/services/planning/testSuiteService";

import CreateTestSuiteModal from "@/components/execution/test-suites/CreateTestSuiteModal";
import EditTestSuiteModal from "@/components/execution/test-suites/EditTestSuiteModal";
import TestSuiteCard from "@/components/execution/test-suites/TestSuiteCard";

import "./testSuitePage.css";

/* --------------------------------
   STATUS OPTIONS
--------------------------------- */
const suiteStatusOptions = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Archived", value: "ARCHIVED" },
];

export default function TestSuitePage() {
    const { project, loading: projectLoading } = useProject();
    const projectId = project?.id ?? null;

    const router = useRouter();
    const params = useParams();

    const company = params.company as string;
    const projectSlug = params.project as string;

    /* --------------------------------
       UI STATE
    --------------------------------- */
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [showCreate, setShowCreate] = useState(false);
    const [editSuite, setEditSuite] = useState<any>(null);

    /* --------------------------------
       DATA
    --------------------------------- */
    const {
        testSuites,
        loading,
        setTestSuites,
    } = useTestSuites(projectId);

    if (projectLoading || !projectId) return null;

    /* --------------------------------
       FILTER
    --------------------------------- */
    const filtered = testSuites.filter((suite) => {
        if (status !== "ALL" && suite.status !== status)
            return false;

        if (
            search &&
            !suite.name.toLowerCase().includes(search.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <div className="testsuite-root">
            {/* CONTENT */}
            <main className="testsuite-content">
                {/* HEADER */}
                <div className="flows-page-header">
                    <Breadcrumbs
                        items={[
                            { label: "Overview", href: "../overview" },
                            { label: "Test Suite" },
                        ]}
                    />

                    <h1 className="flows-title">
                        Test Suite
                    </h1>

                    <div className="flows-toolbar-row">
                        <div className="flows-toolbar-left">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search test suites"
                            />

                            <StatusFilter
                                value={status}
                                onChange={setStatus}
                                options={suiteStatusOptions}
                            />
                        </div>

                        <button
                            className="create-flow-btn"
                            onClick={() => {
                                setEditSuite(null);
                                setShowCreate(true);
                            }}
                        >
                            + Create test suite
                        </button>
                    </div>
                </div>

                {/* GRID */}
                {loading ? (
                    <div className="flows-empty">
                        Loading test suites...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flows-empty">
                        No test suites found
                    </div>
                ) : (
                    <div className="flows-grid">
                        {filtered.map((suite) => (
                            <TestSuiteCard
                                key={suite.id}
                                suite={suite}
                                onOpen={() => {
                                    setShowCreate(false);
                                    setEditSuite(suite);
                                }}
                                onEdit={() => {
                                    setShowCreate(false);
                                    setEditSuite(suite);
                                }}
                                onDelete={async () => {
                                    try {
                                        await deleteTestSuite(suite.id);
                                        setTestSuites((prev) =>
                                            prev.filter((x) => x.id !== suite.id)
                                        );
                                        toast.success("Test suite deleted");
                                    } catch {
                                        toast.error("Failed to delete test suite");
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* CREATE */}
            {showCreate && (
                <CreateTestSuiteModal
                    projectId={projectId}
                    onClose={() => setShowCreate(false)}
                    onSuccess={(newSuite) => {
                        setTestSuites((prev) => [
                            newSuite,
                            ...prev,
                        ]);
                        toast.success("Test suite created");
                        setShowCreate(false);
                    }}
                    onGoToLocalTestCases={() => {
                        router.push(
                            `/company/${company}/projects/${projectSlug}/execution/local-test-cases`
                        );
                    }}
                />
            )}

            {/* EDIT */}
            {editSuite && (
                <EditTestSuiteModal
                    projectId={projectId}
                    suite={editSuite}
                    onClose={() => setEditSuite(null)}
                    onSave={async (data) => {
                        const updated = await updateTestSuite(
                            editSuite.id,
                            data
                        );

                        setTestSuites((prev) =>
                            prev.map((s) =>
                                s.id === updated.id
                                    ? updated
                                    : s
                            )
                        );

                        toast.success("Test suite updated");
                        setEditSuite(null);
                    }}
                    onGoToLocalTestCases={() => {
                        router.push(
                            `/company/${company}/projects/${projectSlug}/execution/local-test-cases`
                        );
                    }}
                />
            )}
        </div>
    );
}
