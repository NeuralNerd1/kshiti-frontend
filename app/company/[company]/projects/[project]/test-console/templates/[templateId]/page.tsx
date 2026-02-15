"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

import { useProject } from "@/hooks/projects/useProject";
import { useTemplateDetail } from "@/hooks/test-plan/useTemplateDetail";

import { createEntityType, updateEntityType, deleteEntityType } from "@/services/test-plan/entityTypeService";
import { createField, updateField, deleteField } from "@/services/test-plan/fieldService";
import {
    createState,
    deleteState,
    updateState,
    createTransition,
    deleteTransition,
} from "@/services/test-plan/workflowService";
import {
    submitTemplate,
    assignReviewer,
    createFinalTemplate,
    activateTemplate,
} from "@/services/test-plan/templateService";
import { listProjectUsers, type ProjectUser } from "@/services/test-plan/projectUserService";

import { toast } from "@/components/common/toast/toast";

import type {
    PlanningEntityType,
    WorkflowState,
    WorkflowTransition,
} from "@/types/testPlan";
import type { SchemaField } from "@/services/test-plan/schemaService";

import "@/styles/test-console/testConsole.css";
import "@/styles/test-console/templateDetail.css";

/* Human-readable label map for project permission keys */
const ROLE_OPTIONS: { key: string; label: string }[] = [
    { key: "can_create_planning_items", label: "Create Items" },
    { key: "can_edit_planning_items", label: "Edit Items" },
    { key: "can_review_planning_items", label: "Review Items" },
    { key: "can_create_templates", label: "Create Templates" },
    { key: "can_edit_templates", label: "Edit Templates" },
    { key: "can_submit_templates", label: "Submit Templates" },
    { key: "can_approve_templates", label: "Approve Templates" },
    { key: "can_bind_execution", label: "Bind Execution" },
    { key: "can_execute_tests", label: "Execute Tests" },
    { key: "can_track_time", label: "Track Time" },
    { key: "can_manage_project_users", label: "Manage Users" },
    { key: "can_edit_project", label: "Edit Project" },
];

function roleLabel(key: string): string {
    return ROLE_OPTIONS.find(r => r.key === key)?.label ?? key.replace(/^can_/, "").replace(/_/g, " ");
}

/* ========================================
   STATUS MAP
   ======================================== */
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Draft", cls: "draft" },
    SUBMITTED: { label: "Submitted", cls: "submitted" },
    APPROVAL_PENDING: { label: "Pending Approval", cls: "pending" },
    APPROVED: { label: "Approved", cls: "approved" },
    CREATED: { label: "Created", cls: "created" },
    REJECTED: { label: "Rejected", cls: "rejected" },
    ACTIVATED: { label: "Activated", cls: "activated" },
};

/* ========================================
   DRAG HANDLE COMPONENT (6 dots)
   ======================================== */
function DragHandle() {
    return (
        <div className="drag-handle">
            <div className="drag-handle-dot-row">
                <span className="drag-handle-dot" />
                <span className="drag-handle-dot" />
            </div>
            <div className="drag-handle-dot-row">
                <span className="drag-handle-dot" />
                <span className="drag-handle-dot" />
            </div>
            <div className="drag-handle-dot-row">
                <span className="drag-handle-dot" />
                <span className="drag-handle-dot" />
            </div>
        </div>
    );
}

/* ========================================
   FIELD GROUP COMPONENT
   ======================================== */
function FieldGroup({
    label,
    source,
    fields,
    isEditable,
    onEdit,
    onDelete,
}: {
    label: string;
    source: "system" | "default_template" | "custom";
    fields: SchemaField[];
    isEditable: boolean;
    onEdit?: (field: SchemaField) => void;
    onDelete?: (fieldId: number) => void;
}) {
    if (fields.length === 0) return null;

    return (
        <div className="field-group">
            <div className="field-group-header">
                <span className={`field-source-dot ${source}`} />
                <span className={`field-group-label ${source}`}>{label}</span>
                <span className="field-group-count">{fields.length}</span>
            </div>
            <div className="fields-grid">
                {fields.map((field, idx) => (
                    <div key={field.id ?? `${source}-${idx}`} className="field-card">
                        <div className="field-card-info">
                            <span className="field-card-name">
                                {field.display_name}
                            </span>
                            <div className="field-card-meta">
                                <span className="field-type-tag">
                                    {field.field_type}
                                </span>
                                {field.is_required && (
                                    <span className="field-required-badge">
                                        Required
                                    </span>
                                )}
                                <span>{field.field_key}</span>
                            </div>
                        </div>
                        {isEditable && source === "custom" && field.id && (
                            <div className="field-card-actions" style={{ opacity: 1 }}>
                                {onEdit && (
                                    <button
                                        className="field-action-btn edit"
                                        onClick={() => onEdit(field)}
                                        title="Edit field"
                                    >
                                        ✎
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="field-action-btn danger"
                                        onClick={() => onDelete(field.id!)}
                                        title="Delete field"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ========================================
   PAGE
   ======================================== */
export default function TemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { project, loading: projectLoading } = useProject();
    const projectId = project?.id ?? null;

    const company = params.company as string;
    const projectSlug = params.project as string;
    const templateId = params.templateId
        ? Number(params.templateId)
        : null;

    /* --- Permissions & flags from project --- */
    const permissions: Record<string, boolean> = project?.permissions ?? {};
    const needsApproval: boolean = project?.template_needs_approval ?? false;

    const canSubmit = permissions.can_submit_templates ?? false;
    const canCreate = permissions.can_create_templates ?? false;

    const {
        template,
        entityTypes,
        selectedEntityId,
        setSelectedEntityId,
        schema,
        workflowDetail,
        loading,
        refreshTemplate,
        refreshEntityData,
    } = useTemplateDetail(projectId, templateId);

    /* ---- Modals ---- */
    const [showAddEntity, setShowAddEntity] = useState(false);
    const [showAddField, setShowAddField] = useState(false);
    const [showAddState, setShowAddState] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    /* ---- Edit modals ---- */
    const [editEntity, setEditEntity] = useState<PlanningEntityType | null>(null);
    const [editEntityName, setEditEntityName] = useState("");
    const [editField, setEditField] = useState<SchemaField | null>(null);
    const [editFieldName, setEditFieldName] = useState("");
    const [editFieldType, setEditFieldType] = useState("text");
    const [editFieldRequired, setEditFieldRequired] = useState(false);
    const [editState, setEditState] = useState<WorkflowState | null>(null);
    const [editStateName, setEditStateName] = useState("");
    const [editStateIsFinal, setEditStateIsFinal] = useState(false);

    /* ---- Confirm delete dialogs ---- */
    const [confirmDeleteEntity, setConfirmDeleteEntity] = useState<PlanningEntityType | null>(null);
    const [confirmDeleteState, setConfirmDeleteState] = useState<WorkflowState | null>(null);

    /* ---- Transition modal ---- */
    const [showAddTransition, setShowAddTransition] = useState(false);
    const [transFromState, setTransFromState] = useState<number | null>(null);
    const [transToState, setTransToState] = useState<number | null>(null);
    const [transAllowedRoles, setTransAllowedRoles] = useState<string[]>([]);

    function toggleRole(role: string) {
        setTransAllowedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    }

    /* ---- Add Entity form state ---- */
    const [newEntityKey, setNewEntityKey] = useState("");
    const [newEntityName, setNewEntityName] = useState("");

    /* ---- Add Field form state ---- */
    const [newFieldKey, setNewFieldKey] = useState("");
    const [newFieldName, setNewFieldName] = useState("");
    const [newFieldType, setNewFieldType] = useState("text");
    const [newFieldRequired, setNewFieldRequired] = useState(false);

    /* ---- Add State form state ---- */
    const [newStateName, setNewStateName] = useState("");
    const [newStateIsFinal, setNewStateIsFinal] = useState(false);

    /* ---- Submit / Reviewer state ---- */
    const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
    const [selectedReviewerId, setSelectedReviewerId] = useState<number | null>(null);
    const [reviewerError, setReviewerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /* ---- Drag-and-drop state ---- */
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    /* ---- Action loading ---- */
    const [actionLoading, setActionLoading] = useState(false);

    /* ---- isEditable: only DRAFT templates are editable ---- */
    const isEditable = template?.status === "DRAFT";

    /* ---- Fetch project users when submit modal opens ---- */
    useEffect(() => {
        if (showSubmitModal && projectId) {
            listProjectUsers(projectId)
                .then(setProjectUsers)
                .catch(() => setProjectUsers([]));
        }
    }, [showSubmitModal, projectId]);

    /* ---- Loading / Error ---- */
    if (projectLoading || loading) {
        return (
            <div className="template-detail-root">
                <div className="detail-empty-state" style={{ margin: "auto" }}>
                    Loading…
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="template-detail-root">
                <div className="detail-empty-state" style={{ margin: "auto" }}>
                    Template not found.
                </div>
            </div>
        );
    }

    const status = STATUS_MAP[template.status] ?? {
        label: template.status,
        cls: "draft",
    };

    const selectedEntity = entityTypes.find(
        (e) => e.id === selectedEntityId
    );

    /* ========================================
       HEADER ACTION LOGIC
       ======================================== */

    // Flow: DRAFT → "Submit for Review" (if needsApproval) OR "Create" (if !needsApproval)
    // SUBMITTED → (assign reviewer done server-side)
    // APPROVED → "Create"
    function renderHeaderActions() {
        const actions: React.ReactNode[] = [];

        if (template!.status === "DRAFT") {
            if (needsApproval && canSubmit) {
                actions.push(
                    <button
                        key="submit"
                        className="header-action-btn warning"
                        onClick={() => setShowSubmitModal(true)}
                        disabled={actionLoading}
                    >
                        Submit for Review
                    </button>
                );
            }
            if (!needsApproval && canCreate) {
                actions.push(
                    <button
                        key="create"
                        className="header-action-btn success"
                        onClick={handleCreateFinal}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Creating…" : "Create"}
                    </button>
                );
            }
        }

        if (template!.status === "APPROVED" && canCreate) {
            actions.push(
                <button
                    key="create"
                    className="header-action-btn success"
                    onClick={handleCreateFinal}
                    disabled={actionLoading}
                >
                    {actionLoading ? "Creating…" : "Create"}
                </button>
            );
        }

        if ((template!.status === "CREATED" || template!.status === "ACTIVATED") && template!.is_locked) {
            actions.push(
                <button
                    key="activate"
                    className="header-action-btn activate"
                    onClick={handleActivate}
                    disabled={actionLoading}
                >
                    {actionLoading ? "Activating…" : "⚡ Activate Template"}
                </button>
            );
        }

        return actions.length > 0 ? (
            <div className="template-detail-header-right">{actions}</div>
        ) : null;
    }

    /* ========================================
       HANDLERS
       ======================================== */

    async function handleCreateFinal() {
        if (!projectId || !templateId) return;
        setActionLoading(true);
        try {
            await createFinalTemplate(projectId, templateId);
            toast.success("Template created and locked");
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to create template");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleActivate() {
        if (!projectId || !templateId) return;
        setActionLoading(true);
        try {
            await activateTemplate(projectId, templateId);
            toast.success("Template activated for this project!");
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to activate template");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleSubmitForReview() {
        if (!projectId || !templateId) return;

        // Validation: reviewer must be selected when approval is needed
        if (needsApproval && !selectedReviewerId) {
            setReviewerError("Please select a reviewer before submitting.");
            return;
        }

        setSubmitting(true);
        setReviewerError("");

        try {
            // Fetch fresh template to get real DB status
            const fresh = await (await import("@/services/test-plan/templateService")).getTemplateDetail(projectId, templateId);
            const currentStatus = fresh.status;

            // Step 1: Submit only if still DRAFT
            if (currentStatus === "DRAFT") {
                await submitTemplate(projectId, templateId);
            }

            // Step 2: Assign reviewer (SUBMITTED → APPROVAL_PENDING)
            if (selectedReviewerId) {
                await assignReviewer(projectId, templateId, selectedReviewerId);
            }

            toast.success("Template submitted for review");
            setShowSubmitModal(false);
            setSelectedReviewerId(null);
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to submit template");
            // Always refresh to show the actual DB state
            refreshTemplate();
        } finally {
            setSubmitting(false);
        }
    }

    async function handleAddEntity() {
        if (!projectId || !templateId || !newEntityKey.trim()) return;
        try {
            await createEntityType(projectId, templateId, {
                internal_key: newEntityKey.toLowerCase().replace(/\s+/g, "_"),
                display_name: newEntityName || newEntityKey,
                level_order: entityTypes.length + 1,
                allow_children: true,
                allow_execution_binding: false,
                allow_dependencies: true,
                allow_time_tracking: false,
            });
            toast.success("Entity type created");
            setShowAddEntity(false);
            setNewEntityKey("");
            setNewEntityName("");
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to create entity type");
        }
    }

    async function handleDeleteEntity(entityId: number) {
        if (!projectId) return;
        try {
            await deleteEntityType(projectId, entityId);
            toast.success("Entity type deleted");
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete entity type");
        }
    }

    async function handleAddField() {
        if (!projectId || !selectedEntityId || !newFieldKey.trim()) return;
        try {
            // Compute max order across ALL field groups to avoid unique constraint
            const allFields = [
                ...(schema?.system_fields ?? []),
                ...(schema?.default_template_fields ?? []),
                ...(schema?.custom_fields ?? []),
            ];
            const maxOrder = allFields.reduce(
                (max, f) => Math.max(max, f.order ?? 0),
                0
            );

            await createField(projectId, selectedEntityId, {
                field_key: newFieldKey.toLowerCase().replace(/\s+/g, "_"),
                display_name: newFieldName || newFieldKey,
                field_type: newFieldType as any,
                is_required: newFieldRequired,
                order: maxOrder + 1,
            });
            toast.success("Field created");
            setShowAddField(false);
            setNewFieldKey("");
            setNewFieldName("");
            setNewFieldType("text");
            setNewFieldRequired(false);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to create field");
        }
    }

    async function handleDeleteField(fieldId: number) {
        if (!projectId) return;
        try {
            await deleteField(projectId, fieldId);
            toast.success("Field deleted");
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete field");
        }
    }

    /* ---- Edit Entity ---- */
    function openEditEntity(entity: PlanningEntityType) {
        setEditEntity(entity);
        setEditEntityName(entity.display_name);
    }

    async function handleEditEntity() {
        if (!projectId || !editEntity || !editEntityName.trim()) return;
        try {
            await updateEntityType(projectId, editEntity.id, {
                display_name: editEntityName,
            });
            toast.success("Entity type updated");
            setEditEntity(null);
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to update entity type");
        }
    }

    /* ---- Confirm Delete Entity ---- */
    async function handleConfirmDeleteEntity() {
        if (!projectId || !confirmDeleteEntity) return;
        try {
            await deleteEntityType(projectId, confirmDeleteEntity.id);
            toast.success("Entity type deleted");
            setConfirmDeleteEntity(null);
            refreshTemplate();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete entity type");
        }
    }

    /* ---- Edit Field ---- */
    function openEditField(field: SchemaField) {
        setEditField(field);
        setEditFieldName(field.display_name);
        setEditFieldType(field.field_type);
        setEditFieldRequired(field.is_required ?? false);
    }

    async function handleEditField() {
        if (!projectId || !editField?.id || !editFieldName.trim()) return;
        try {
            await updateField(projectId, editField.id, {
                field_key: editField.field_key,
                display_name: editFieldName,
                field_type: editFieldType as any,
                is_required: editFieldRequired,
                order: editField.order ?? 1,
            });
            toast.success("Field updated");
            setEditField(null);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to update field");
        }
    }

    /* ---- Edit State ---- */
    function openEditState(state: WorkflowState) {
        setEditState(state);
        setEditStateName(state.name);
        setEditStateIsFinal(state.is_final);
    }

    async function handleEditState() {
        if (!projectId || !editState || !editStateName.trim()) return;
        try {
            await updateState(projectId, editState.id, {
                name: editStateName,
                is_final: editStateIsFinal,
            });
            toast.success("State updated");
            setEditState(null);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to update state");
        }
    }

    /* ---- Confirm Delete State ---- */
    async function handleConfirmDeleteState() {
        if (!projectId || !confirmDeleteState) return;
        try {
            await deleteState(projectId, confirmDeleteState.id);
            toast.success("State deleted");
            setConfirmDeleteState(null);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete state");
        }
    }

    /* ---- Transitions ---- */
    async function handleAddTransition() {
        if (!projectId || !workflowDetail || transFromState === null || transToState === null) return;
        try {
            await createTransition(projectId, workflowDetail.workflow.id, {
                from_state: transFromState,
                to_state: transToState,
                allowed_roles: transAllowedRoles,
            });
            toast.success("Transition added");
            setShowAddTransition(false);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to add transition");
        }
    }

    async function handleDeleteTransition(transitionId: number) {
        if (!projectId) return;
        try {
            await deleteTransition(projectId, transitionId);
            toast.success("Transition deleted");
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete transition");
        }
    }

    async function handleAddState() {
        if (!projectId || !workflowDetail || !newStateName.trim()) return;
        try {
            const states = workflowDetail.states ?? [];
            // Insert before final states: find first final state index
            const firstFinalIdx = states.findIndex((s) => s.is_final);
            const insertOrder =
                firstFinalIdx >= 0
                    ? states[firstFinalIdx].order
                    : states.length + 1;

            // Bump orders of states at or after insertOrder
            const bumpPromises = states
                .filter((s) => s.order >= insertOrder)
                .map((s) =>
                    updateState(projectId!, s.id, { name: s.name, order: s.order + 1 })
                );
            await Promise.all(bumpPromises);

            // If new state is final, unmark ALL existing final states
            if (newStateIsFinal) {
                const unmarkPromises = states
                    .filter((s) => s.is_final)
                    .map((s) =>
                        updateState(projectId!, s.id, {
                            name: s.name,
                            is_final: false,
                        })
                    );
                await Promise.all(unmarkPromises);
            }

            await createState(projectId, workflowDetail.workflow.id, {
                name: newStateName,
                is_final: newStateIsFinal,
                order: insertOrder,
            });

            toast.success("State created");
            setShowAddState(false);
            setNewStateName("");
            setNewStateIsFinal(false);
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to create state");
        }
    }

    async function handleDeleteState(stateId: number) {
        if (!projectId) return;
        try {
            await deleteState(projectId, stateId);
            toast.success("State deleted");
            refreshEntityData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete state");
        }
    }

    /* ========================================
       DRAG & DROP HANDLERS
       ======================================== */

    function handleDragStart(index: number) {
        setDragIndex(index);
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setDragOverIndex(index);
    }

    function handleDragLeave() {
        setDragOverIndex(null);
    }

    async function handleDrop(targetIndex: number) {
        if (dragIndex === null || dragIndex === targetIndex || !projectId) {
            setDragIndex(null);
            setDragOverIndex(null);
            return;
        }

        const states = [...(workflowDetail?.states ?? [])];
        const [moved] = states.splice(dragIndex, 1);
        states.splice(targetIndex, 0, moved);

        // Update all orders
        try {
            await Promise.all(
                states.map((s, i) =>
                    updateState(projectId!, s.id, { name: s.name, order: i + 1 })
                )
            );
            refreshEntityData();
        } catch (e: any) {
            toast.error("Failed to reorder states");
        }

        setDragIndex(null);
        setDragOverIndex(null);
    }

    function handleDragEnd() {
        setDragIndex(null);
        setDragOverIndex(null);
    }

    /* ========================================
       RENDER
       ======================================== */
    return (
        <div className="template-detail-root">
            {/* ---- ENTITY SIDEBAR ---- */}
            <div className="entity-sidebar">
                <div className="entity-sidebar-header">
                    <span className="entity-sidebar-title">Entity Types</span>
                    {isEditable && (
                        <button
                            className="entity-sidebar-add"
                            onClick={() => setShowAddEntity(true)}
                            title="Add entity type"
                        >
                            +
                        </button>
                    )}
                </div>

                <div className="entity-list">
                    {entityTypes.map((entity) => (
                        <div
                            key={entity.id}
                            className={`entity-item ${selectedEntityId === entity.id ? "active" : ""}`}
                            onClick={() => setSelectedEntityId(entity.id)}
                        >
                            <div className="entity-item-info">
                                <span className="entity-level-badge">
                                    {entity.level_order}
                                </span>
                                <span>{entity.display_name}</span>
                            </div>
                            {isEditable && (
                                <div className="entity-item-actions">
                                    <button
                                        className="field-action-btn edit"
                                        onClick={(e) => { e.stopPropagation(); openEditEntity(entity); }}
                                        title="Edit entity"
                                    >✎</button>
                                    <button
                                        className="field-action-btn danger"
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteEntity(entity); }}
                                        title="Delete entity"
                                    >✕</button>
                                </div>
                            )}
                        </div>
                    ))}

                    {entityTypes.length === 0 && (
                        <div className="detail-empty-state">
                            <div className="detail-empty-icon">📋</div>
                            No entity types yet
                        </div>
                    )}
                </div>
            </div>

            {/* ---- MAIN CONTENT ---- */}
            <div className="template-detail-content">
                {/* ---- HEADER ---- */}
                <div className="template-detail-header">
                    <div className="template-detail-header-left">
                        <button
                            className="template-detail-back"
                            onClick={() =>
                                router.push(
                                    `/company/${company}/projects/${projectSlug}/test-console`
                                )
                            }
                            title="Back to templates"
                        >
                            ←
                        </button>

                        <div className="template-detail-info">
                            <div className="template-detail-name">
                                {template.name}
                            </div>
                            <div className="template-detail-meta">
                                <span
                                    className={`template-status-badge ${status.cls}`}
                                >
                                    {status.label}
                                </span>
                                <span className="template-detail-version">
                                    v{template.version_number}
                                </span>
                                {template.is_locked && (
                                    <span className="template-locked-badge">
                                        🔒 Locked
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ---- HEADER ACTIONS ---- */}
                    {renderHeaderActions()}
                </div>

                {/* ---- BODY ---- */}
                <div className="template-detail-body">
                    {!selectedEntity ? (
                        <div className="detail-empty-state">
                            <div className="detail-empty-icon">👈</div>
                            Select an entity type from the sidebar
                        </div>
                    ) : (
                        <>
                            {/* ---- FIELDS SECTION (Schema API) ---- */}
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <span className="detail-section-title">
                                        Fields —{" "}
                                        {selectedEntity.display_name}
                                    </span>
                                    {isEditable && (
                                        <button
                                            className="detail-section-add"
                                            onClick={() =>
                                                setShowAddField(true)
                                            }
                                        >
                                            + Add Field
                                        </button>
                                    )}
                                </div>

                                {schema ? (
                                    <>
                                        <FieldGroup
                                            label="System Fields"
                                            source="system"
                                            fields={schema.system_fields}
                                            isEditable={false}
                                        />
                                        <FieldGroup
                                            label="Template Fields"
                                            source="default_template"
                                            fields={schema.default_template_fields}
                                            isEditable={false}
                                        />
                                        <FieldGroup
                                            label="Custom Fields"
                                            source="custom"
                                            fields={schema.custom_fields}
                                            isEditable={isEditable}
                                            onEdit={openEditField}
                                            onDelete={handleDeleteField}
                                        />
                                    </>
                                ) : (
                                    <div className="detail-empty-state">
                                        No fields defined yet.
                                    </div>
                                )}
                            </div>

                            {/* ---- WORKFLOW SECTION ---- */}
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <span className="detail-section-title">
                                        Workflow
                                    </span>
                                    {isEditable && workflowDetail && (
                                        <button
                                            className="detail-section-add"
                                            onClick={() =>
                                                setShowAddState(true)
                                            }
                                        >
                                            + Add State
                                        </button>
                                    )}
                                </div>

                                {!workflowDetail ? (
                                    <div className="detail-empty-state">
                                        No workflow defined.
                                    </div>
                                ) : (
                                    <div className="workflow-states-list">
                                        {workflowDetail.states.map(
                                            (state: WorkflowState, idx: number) => (
                                                <div
                                                    key={state.id}
                                                    className={`workflow-state-card${dragIndex === idx
                                                        ? " dragging"
                                                        : ""
                                                        }${dragOverIndex === idx
                                                            ? " drag-over"
                                                            : ""
                                                        }`}
                                                    draggable={isEditable}
                                                    onDragStart={() =>
                                                        handleDragStart(idx)
                                                    }
                                                    onDragOver={(e) =>
                                                        handleDragOver(e, idx)
                                                    }
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={() =>
                                                        handleDrop(idx)
                                                    }
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <div className="workflow-state-info">
                                                        {isEditable && (
                                                            <DragHandle />
                                                        )}
                                                        <span className="workflow-state-order">
                                                            {state.order}
                                                        </span>
                                                        <span className="workflow-state-name">
                                                            {state.name}
                                                        </span>
                                                    </div>
                                                    <div className="workflow-state-tags">
                                                        {workflowDetail
                                                            .workflow
                                                            .initial_state ===
                                                            state.id && (
                                                                <span className="workflow-initial-tag">
                                                                    Initial
                                                                </span>
                                                            )}
                                                        {state.is_final && (
                                                            <span className="workflow-final-tag">
                                                                Final
                                                            </span>
                                                        )}
                                                        {isEditable && (
                                                            <>
                                                                <button
                                                                    className="field-action-btn edit"
                                                                    onClick={() => openEditState(state)}
                                                                    title="Edit state"
                                                                >
                                                                    ✎
                                                                </button>
                                                                <button
                                                                    className="field-action-btn danger"
                                                                    onClick={() => setConfirmDeleteState(state)}
                                                                    title="Delete state"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ---- TRANSITIONS SECTION ---- */}
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <span className="detail-section-title">
                                        Transitions
                                    </span>
                                    {isEditable && workflowDetail && workflowDetail.states.length >= 2 && (
                                        <button
                                            className="detail-section-add"
                                            onClick={() => {
                                                setTransFromState(null);
                                                setTransToState(null);
                                                setTransAllowedRoles([]);
                                                setShowAddTransition(true);
                                            }}
                                        >
                                            + Add Transition
                                        </button>
                                    )}
                                </div>

                                {!workflowDetail || workflowDetail.transitions.length === 0 ? (
                                    <div className="detail-empty-state">
                                        {!workflowDetail
                                            ? "No workflow defined."
                                            : "No transitions defined. Add transitions to connect states."}
                                    </div>
                                ) : (
                                    <div className="transitions-list">
                                        {workflowDetail.transitions.map((t: WorkflowTransition) => {
                                            const fromName = workflowDetail.states.find(s => s.id === t.from_state)?.name ?? `State #${t.from_state}`;
                                            const toName = workflowDetail.states.find(s => s.id === t.to_state)?.name ?? `State #${t.to_state}`;
                                            const fromState = workflowDetail.states.find(s => s.id === t.from_state);
                                            const toState = workflowDetail.states.find(s => s.id === t.to_state);
                                            return (
                                                <div key={t.id} className="transition-card">
                                                    <div className="transition-flow">
                                                        <span className={`transition-state-chip ${fromState?.is_final ? 'final' : ''} ${workflowDetail.workflow.initial_state === t.from_state ? 'initial' : ''}`}>
                                                            {fromName}
                                                        </span>
                                                        <span className="transition-arrow">
                                                            <svg width="24" height="12" viewBox="0 0 24 12">
                                                                <path d="M0 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                        <span className={`transition-state-chip ${toState?.is_final ? 'final' : ''} ${workflowDetail.workflow.initial_state === t.to_state ? 'initial' : ''}`}>
                                                            {toName}
                                                        </span>
                                                    </div>
                                                    {t.allowed_roles && t.allowed_roles.length > 0 && (
                                                        <div className="transition-roles">
                                                            {t.allowed_roles.map(role => (
                                                                <span key={role} className="transition-role-badge" title={role}>
                                                                    {roleLabel(role)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isEditable && (
                                                        <button
                                                            className="field-action-btn danger"
                                                            onClick={() => handleDeleteTransition(t.id)}
                                                            title="Delete transition"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ======== MODALS ======== */}

            {/* Add Entity Modal */}
            {showAddEntity && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Entity Type</h2>
                        <div className="formGroup">
                            <label className="formLabel">Internal Key</label>
                            <input
                                className="formInput"
                                value={newEntityKey}
                                onChange={(e) => setNewEntityKey(e.target.value)}
                                placeholder="e.g. sprint, epic, story"
                            />
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Display Name</label>
                            <input
                                className="formInput"
                                value={newEntityName}
                                onChange={(e) =>
                                    setNewEntityName(e.target.value)
                                }
                                placeholder="e.g. Sprint, Epic, Story"
                            />
                        </div>
                        <div className="formActions">
                            <button
                                className="btnSecondary"
                                onClick={() => setShowAddEntity(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btnPrimary"
                                onClick={handleAddEntity}
                                disabled={!newEntityKey.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Field Modal */}
            {showAddField && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Custom Field</h2>
                        <div className="formGroup">
                            <label className="formLabel">Field Key</label>
                            <input
                                className="formInput"
                                value={newFieldKey}
                                onChange={(e) => setNewFieldKey(e.target.value)}
                                placeholder="e.g. priority, severity"
                            />
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Display Name</label>
                            <input
                                className="formInput"
                                value={newFieldName}
                                onChange={(e) => setNewFieldName(e.target.value)}
                                placeholder="e.g. Priority, Severity"
                            />
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Field Type</label>
                            <select
                                className="formInput"
                                value={newFieldType}
                                onChange={(e) =>
                                    setNewFieldType(e.target.value)
                                }
                            >
                                <option value="text">Text</option>
                                <option value="long_text">Long Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="datetime">DateTime</option>
                                <option value="select">Select</option>
                                <option value="multi_select">
                                    Multi Select
                                </option>
                                <option value="user">User</option>
                                <option value="multi_user">Multi User</option>
                                <option value="boolean">Boolean</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <div className="formGroup">
                            <label
                                className="formLabel"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={newFieldRequired}
                                    onChange={(e) =>
                                        setNewFieldRequired(e.target.checked)
                                    }
                                />
                                Required
                            </label>
                        </div>
                        <div className="formActions">
                            <button
                                className="btnSecondary"
                                onClick={() => setShowAddField(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btnPrimary"
                                onClick={handleAddField}
                                disabled={!newFieldKey.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add State Modal */}
            {showAddState && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Workflow State</h2>
                        <div className="formGroup">
                            <label className="formLabel">State Name</label>
                            <input
                                className="formInput"
                                value={newStateName}
                                onChange={(e) =>
                                    setNewStateName(e.target.value)
                                }
                                placeholder="e.g. In Review, Ready"
                            />
                        </div>
                        <div className="formGroup">
                            <label
                                className="formLabel"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={newStateIsFinal}
                                    onChange={(e) =>
                                        setNewStateIsFinal(e.target.checked)
                                    }
                                />
                                Final State
                            </label>
                        </div>
                        <div className="formActions">
                            <button
                                className="btnSecondary"
                                onClick={() => setShowAddState(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btnPrimary"
                                onClick={handleAddState}
                                disabled={!newStateName.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit for Review Modal (with reviewer validation) */}
            {showSubmitModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Submit for Review</h2>
                        <p style={{ color: "#94a3b8", fontSize: 13 }}>
                            This template will be submitted for approval. Please
                            select a reviewer who will evaluate the template.
                        </p>

                        <div className="formGroup">
                            <label className="formLabel">
                                Select Reviewer *
                            </label>
                            <select
                                className="reviewer-select"
                                value={selectedReviewerId ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedReviewerId(
                                        val ? Number(val) : null
                                    );
                                    setReviewerError("");
                                }}
                            >
                                <option value="">
                                    — Choose a reviewer —
                                </option>
                                {projectUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.email} ({u.role})
                                    </option>
                                ))}
                            </select>
                            {reviewerError && (
                                <span className="reviewer-validation-error">
                                    {reviewerError}
                                </span>
                            )}
                        </div>

                        <div className="formActions">
                            <button
                                className="btnSecondary"
                                onClick={() => {
                                    setShowSubmitModal(false);
                                    setSelectedReviewerId(null);
                                    setReviewerError("");
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btnPrimary"
                                onClick={handleSubmitForReview}
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Submitting…"
                                    : "Submit for Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Entity Modal */}
            {editEntity && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Edit Entity Type</h2>
                        <div className="formGroup">
                            <label className="formLabel">Display Name</label>
                            <input
                                className="formInput"
                                value={editEntityName}
                                onChange={(e) => setEditEntityName(e.target.value)}
                            />
                        </div>
                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setEditEntity(null)}>Cancel</button>
                            <button className="btnPrimary" onClick={handleEditEntity} disabled={!editEntityName.trim()}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Field Modal */}
            {editField && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Edit Field</h2>
                        <div className="formGroup">
                            <label className="formLabel">Display Name</label>
                            <input
                                className="formInput"
                                value={editFieldName}
                                onChange={(e) => setEditFieldName(e.target.value)}
                            />
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Field Type</label>
                            <select
                                className="formInput"
                                value={editFieldType}
                                onChange={(e) => setEditFieldType(e.target.value)}
                            >
                                <option value="text">Text</option>
                                <option value="long_text">Long Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="datetime">DateTime</option>
                                <option value="select">Select</option>
                                <option value="multi_select">Multi Select</option>
                                <option value="user">User</option>
                                <option value="multi_user">Multi User</option>
                                <option value="boolean">Boolean</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <div className="formGroup">
                            <label className="formLabel" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={editFieldRequired}
                                    onChange={(e) => setEditFieldRequired(e.target.checked)}
                                />
                                Required
                            </label>
                        </div>
                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setEditField(null)}>Cancel</button>
                            <button className="btnPrimary" onClick={handleEditField} disabled={!editFieldName.trim()}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit State Modal */}
            {editState && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Edit Workflow State</h2>
                        <div className="formGroup">
                            <label className="formLabel">State Name</label>
                            <input
                                className="formInput"
                                value={editStateName}
                                onChange={(e) => setEditStateName(e.target.value)}
                            />
                        </div>
                        <div className="formGroup">
                            <label className="formLabel" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={editStateIsFinal}
                                    onChange={(e) => setEditStateIsFinal(e.target.checked)}
                                />
                                Final State
                            </label>
                        </div>
                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setEditState(null)}>Cancel</button>
                            <button className="btnPrimary" onClick={handleEditState} disabled={!editStateName.trim()}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Entity Dialog */}
            {confirmDeleteEntity && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Delete Entity Type</h2>
                        <p style={{ color: "#94a3b8", fontSize: 14 }}>
                            Are you sure you want to delete <strong>{confirmDeleteEntity.display_name}</strong>?
                            This will also delete all associated fields and workflows.
                        </p>
                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setConfirmDeleteEntity(null)}>Cancel</button>
                            <button className="btnDanger" onClick={handleConfirmDeleteEntity}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete State Dialog */}
            {confirmDeleteState && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Delete Workflow State</h2>
                        <p style={{ color: "#94a3b8", fontSize: 14 }}>
                            Are you sure you want to delete <strong>{confirmDeleteState.name}</strong>?
                        </p>
                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setConfirmDeleteState(null)}>Cancel</button>
                            <button className="btnDanger" onClick={handleConfirmDeleteState}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Transition Modal */}
            {showAddTransition && workflowDetail && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Transition</h2>
                        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                            Define a transition between two workflow states.
                        </p>
                        <div className="formGroup">
                            <label className="formLabel">From State</label>
                            <select
                                className="formInput"
                                value={transFromState ?? ""}
                                onChange={(e) => setTransFromState(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Select source state…</option>
                                {workflowDetail.states.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}{s.is_final ? " (Final)" : ""}{workflowDetail.workflow.initial_state === s.id ? " (Initial)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="transition-modal-arrow">
                            <svg width="24" height="32" viewBox="0 0 24 32">
                                <path d="M12 2v24M6 20l6 6 6-6" fill="none" stroke="#7c5cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">To State</label>
                            <select
                                className="formInput"
                                value={transToState ?? ""}
                                onChange={(e) => setTransToState(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Select target state…</option>
                                {workflowDetail.states
                                    .filter((s) => s.id !== transFromState)
                                    .map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}{s.is_final ? " (Final)" : ""}{workflowDetail.workflow.initial_state === s.id ? " (Initial)" : ""}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Allowed Roles */}
                        <div className="formGroup">
                            <label className="formLabel">Allowed Roles <span style={{ color: '#64748b', fontWeight: 400 }}>(who can trigger this transition)</span></label>
                            <div className="transition-roles-grid">
                                {ROLE_OPTIONS.map(({ key, label }) => (
                                    <label key={key} className={`transition-role-option ${transAllowedRoles.includes(key) ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={transAllowedRoles.includes(key)}
                                            onChange={() => toggleRole(key)}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                            {transAllowedRoles.length === 0 && (
                                <p className="transition-roles-hint">No roles selected — all users will be able to trigger this transition.</p>
                            )}
                        </div>

                        <div className="formActions">
                            <button className="btnSecondary" onClick={() => setShowAddTransition(false)}>Cancel</button>
                            <button
                                className="btnPrimary"
                                onClick={handleAddTransition}
                                disabled={transFromState === null || transToState === null || transFromState === transToState}
                            >
                                Add Transition
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
