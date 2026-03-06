"use client";

import { createPortal } from "react-dom";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { getVariables } from "@/services/planning/variables/variableService";
import { listElements } from "@/services/planning/elements/elementService";
import "./VariableElementPicker.css";

type Tab = "variables" | "elements";

type Props = {
    projectId: number;
    onInsert: (reference: string) => void;
};

export default function VariableElementPicker({
    projectId,
    onInsert,
}: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("variables");
    const [search, setSearch] = useState("");

    const [variables, setVariables] = useState<any[]>([]);
    const [elements, setElements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchRef = useRef<HTMLInputElement>(null);

    /* ── fetch on open ───────────────────────────── */
    useEffect(() => {
        if (!open) return;
        setLoading(true);

        Promise.all([
            getVariables({ project_id: projectId }),
            listElements(projectId),
        ])
            .then(([vars, elems]) => {
                setVariables(vars);
                setElements(elems);
            })
            .finally(() => setLoading(false));
    }, [open, projectId]);

    /* ── focus search on open ────────────────────── */
    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open]);

    /* ── close on Escape ─────────────────────────── */
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    /* ── filtered lists ──────────────────────────── */
    const q = search.toLowerCase();
    const filteredVars = variables.filter((v) =>
        v.key.toLowerCase().includes(q)
    );
    const filteredElems = elements.filter((el) =>
        el.name.toLowerCase().includes(q)
    );

    const handlePick = (ref: string) => {
        onInsert(ref);
        setOpen(false);
        setSearch("");
    };

    /* ── modal rendered via portal ───────────────── */
    const modal = open && typeof document !== "undefined"
        ? createPortal(
            <div
                className="vep-backdrop"
                onClick={() => setOpen(false)}
            >
                <div
                    className="vep-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="vep-modal-header">
                        <span className="vep-modal-title">
                            Insert Variable or Element
                        </span>
                        <button
                            className="vep-modal-close"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        ref={searchRef}
                        className="vep-search"
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Tabs */}
                    <div className="vep-tabs">
                        <button
                            className={`vep-tab ${tab === "variables" ? "active" : ""}`}
                            onClick={() => setTab("variables")}
                        >
                            Variables
                        </button>
                        <button
                            className={`vep-tab ${tab === "elements" ? "active" : ""}`}
                            onClick={() => setTab("elements")}
                        >
                            Elements
                        </button>
                    </div>

                    {/* List */}
                    <div className="vep-list">
                        {loading ? (
                            <div className="vep-empty">Loading…</div>
                        ) : tab === "variables" ? (
                            filteredVars.length === 0 ? (
                                <div className="vep-empty">No variables found</div>
                            ) : (
                                filteredVars.map((v) => (
                                    <button
                                        key={v.id}
                                        className="vep-item"
                                        onClick={() => handlePick(`{${v.key}}`)}
                                    >
                                        <span className="vep-item-badge var">VAR</span>
                                        <span className="vep-item-label">{v.key}</span>
                                        {v.value && (
                                            <span className="vep-item-value">{v.value}</span>
                                        )}
                                    </button>
                                ))
                            )
                        ) : filteredElems.length === 0 ? (
                            <div className="vep-empty">No elements found</div>
                        ) : (
                            filteredElems.map((el) => (
                                <button
                                    key={el.id}
                                    className="vep-item"
                                    onClick={() => handlePick(`{${el.name}}`)}
                                >
                                    <span className="vep-item-badge elem">EL</span>
                                    <span className="vep-item-label">{el.name}</span>
                                    {el.page_url && (
                                        <span className="vep-item-value">{el.page_url}</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            {/* Trigger button */}
            <button
                type="button"
                className="vep-trigger"
                title="Insert variable or element"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="vep-icon">&#123;&#125;</span>
            </button>

            {modal}
        </>
    );
}
