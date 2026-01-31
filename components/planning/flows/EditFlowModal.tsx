"use client";

import { useState } from "react";
import { updateFlow } from "@/services/planning/flowService";
import { Flow } from "@/types/planning";

type Props = {
  flow: Flow;
  onClose: () => void;
  onUpdated: (flow: Flow) => void;
};

export default function EditFlowModal({
  flow,
  onClose,
  onUpdated,
}: Props) {
  const [name, setName] = useState(flow.name);
  const [description, setDescription] = useState(
    flow.description ?? ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const updated = await updateFlow(flow.id, {
        name,
        description,
      });
      onUpdated(updated);
      onClose();
    } catch (e) {
      alert("Failed to update flow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Edit Flow</h2>

        <label>Name</label>
        <input
          className="formInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Description</label>
        <textarea
          className="formTextarea"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="formActions">
          <button
            className="btnSecondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btnPrimary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
