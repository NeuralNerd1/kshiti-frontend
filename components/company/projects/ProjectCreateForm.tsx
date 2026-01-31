"use client";

import { useState } from "react";

export type ProjectCreateFormProps = {
  users?: { id: number; email: string }[];
  onSubmit: (payload: {
    name: string;
    description?: string;
    max_team_members: number;
    project_admin: number;
  }) => void;
  loading?: boolean;
  error?: string;
};

export default function ProjectCreateForm({
  users = [],
  onSubmit,
  loading = false,
  error,
}: ProjectCreateFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxTeam, setMaxTeam] = useState(1);
  const [admin, setAdmin] = useState<number | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || admin === "") return;

    onSubmit({
      name,
      description,
      max_team_members: maxTeam,
      project_admin: admin,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* =============================
          BASIC DETAILS
      ============================== */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Project Name */}
        <div className="formGroup">
          <label className="formLabel">
            Project name{" "}
            <span style={{ color: "#F87171" }}>*</span>
          </label>
          <input
            className="formInput"
            placeholder="e.g. Mobile App Automation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <p className="formHint">
            This will be visible to all project members
          </p>
        </div>

        {/* Description */}
        <div className="formGroup">
          <label className="formLabel">Description</label>
          <textarea
            className="formTextarea"
            placeholder="Brief description of the project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* =============================
          CONFIGURATION
      ============================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Max Team */}
        <div className="formGroup">
          <label className="formLabel">Max team members</label>
          <input
            className="formInput"
            type="number"
            min={1}
            value={maxTeam}
            onChange={(e) => setMaxTeam(Number(e.target.value))}
            disabled={loading}
          />
          <p className="formHint">
            Maximum users allowed in this project
          </p>
        </div>

        {/* Project Admin */}
        <div className="formGroup">
          <label className="formLabel">
            Project admin{" "}
            <span style={{ color: "#F87171" }}>*</span>
          </label>
          <select
            className="formSelect"
            value={admin}
            onChange={(e) => setAdmin(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
          <p className="formHint">
            Admin can manage members and settings
          </p>
        </div>
      </div>

      {/* =============================
          ERROR STATE
      ============================== */}
      {error && (
        <div
          style={{
            background: "rgba(248, 113, 113, 0.08)",
            border: "1px solid rgba(248, 113, 113, 0.3)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "#F87171",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* =============================
          ACTIONS
      ============================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          paddingTop: 8,
        }}
      >
        <button
          type="button"
          className="btnSecondary"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btnPrimary"
          disabled={loading || !name || admin === ""}
        >
          {loading ? "Creating…" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
