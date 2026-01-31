"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionCategory } from "../types";

type Props = {
  open: boolean;
  registry: ActionCategory[];
  onClose: () => void;
  onAdd: (actionKey: string) => void;
};

export default function QuickAddModal({
  open,
  registry,
  onClose,
  onAdd,
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const actions = useMemo(() => {
    return registry.flatMap((cat) => cat.actions);
  }, [registry]);

  const filtered = useMemo(() => {
    return actions.filter((a) =>
      a.action_name
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [actions, query]);

  if (!open) return null;

  return (
    <div className="quickadd-overlay">
      <div className="quickadd-modal">
        <input
          autoFocus
          placeholder="Search actions..."
          className="formInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="quickadd-list">
          {filtered.map((a) => (
            <div
              key={a.action_key}
              className="quickadd-item"
              onClick={() => {
                onAdd(a.action_key);
                onClose();
              }}
            >
              {a.action_name}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="quickadd-empty">
              No actions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
