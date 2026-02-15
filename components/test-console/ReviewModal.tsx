"use client";

import { useState } from "react";
import type { ProcessTemplate } from "@/types/testPlan";
import {
    approveTemplate,
    rejectTemplate,
} from "@/services/test-plan/templateService";
import { toast } from "@/components/common/toast/toast";

import "@/styles/test-console/reviewBell.css";

type Props = {
    projectId: number;
    template: ProcessTemplate;
    onClose: () => void;
    onComplete: () => void;
};

export default function ReviewModal({
    projectId,
    template,
    onClose,
    onComplete,
}: Props) {
    const [mode, setMode] = useState<"idle" | "rejecting">("idle");
    const [rejectionNote, setRejectionNote] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleApprove() {
        setLoading(true);
        try {
            await approveTemplate(projectId, template.id);
            toast.success("Template approved");
            onComplete();
        } catch (e: any) {
            toast.error(e?.message || "Failed to approve template");
        } finally {
            setLoading(false);
        }
    }

    async function handleReject() {
        if (!rejectionNote.trim()) return;
        setLoading(true);
        try {
            await rejectTemplate(projectId, template.id, rejectionNote);
            toast.success("Template rejected");
            onComplete();
        } catch (e: any) {
            toast.error(e?.message || "Failed to reject template");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card review-modal">
                <h2>Review Template</h2>

                <div className="review-modal-info">
                    <div className="review-modal-label">Template</div>
                    <div className="review-modal-value">{template.name}</div>
                </div>

                {template.description && (
                    <div className="review-modal-info">
                        <div className="review-modal-label">Description</div>
                        <div className="review-modal-value">
                            {template.description}
                        </div>
                    </div>
                )}

                <div className="review-modal-info">
                    <div className="review-modal-label">Version</div>
                    <div className="review-modal-value">
                        v{template.version_number}
                    </div>
                </div>

                {mode === "rejecting" && (
                    <div className="formGroup">
                        <label className="formLabel">
                            Rejection Comment *
                        </label>
                        <textarea
                            className="formInput review-textarea"
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Explain why this template is being rejected…"
                            rows={4}
                        />
                    </div>
                )}

                <div className="formActions">
                    <button
                        className="btnSecondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    {mode === "idle" ? (
                        <>
                            <button
                                className="btnDanger"
                                onClick={() => setMode("rejecting")}
                                disabled={loading}
                            >
                                Reject
                            </button>
                            <button
                                className="btnPrimary review-approve-btn"
                                onClick={handleApprove}
                                disabled={loading}
                            >
                                {loading ? "Approving…" : "Approve"}
                            </button>
                        </>
                    ) : (
                        <button
                            className="btnDanger"
                            onClick={handleReject}
                            disabled={loading || !rejectionNote.trim()}
                        >
                            {loading
                                ? "Rejecting…"
                                : "Confirm Rejection"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
