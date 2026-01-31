"use client";

import VariableCard from "./VariableCard";

interface VariablesGridProps {
  variables: any[];
  loading?: boolean;

  onView: (variable: any) => void;
  onEdit: (variable: any) => void;
  onDelete: (id: number) => void;
}

export default function VariablesGrid({
  variables,
  loading,
  onView,
  onEdit,
  onDelete,
}: VariablesGridProps) {
  if (loading) {
    return (
      <div className="flows-empty">
        Loading variables…
      </div>
    );
  }

  if (!variables.length) {
    return (
      <div className="flows-empty">
        No variables found
      </div>
    );
  }

  return (
    <div className="flows-grid">
      {variables.map((variable) => (
        <VariableCard
          key={variable.id}
          variable={variable}
          onView={() => onView(variable)}
          onEdit={() => onEdit(variable)}
          onDelete={() => onDelete(variable.id)}
        />
      ))}
    </div>
  );
}
