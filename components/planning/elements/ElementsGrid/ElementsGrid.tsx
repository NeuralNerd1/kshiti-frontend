"use client";

import "./elementsGrid.css";
import ElementCard from "./ElementCard";

interface ElementItem {
  id: number;
  name: string;
  folder_id: number;
  page_url?: string | null;
  locators: any[];
}

interface Props {
  elements: ElementItem[];
  loading?: boolean;

  onEdit: (element: ElementItem) => void;
  onDelete: (id: number) => void;
  onOpen?: (id: number) => void;
}

export default function ElementsGrid({
  elements,
  loading,
  onEdit,
  onDelete,
  onOpen,
}: Props) {
  if (loading) {
    return (
      <div className="elements-empty">
        Loading elements…
      </div>
    );
  }

  if (!elements.length) {
    return (
      <div className="elements-empty">
        No elements found
      </div>
    );
  }

  return (
    <div className="elements-grid">
      {elements.map((el) => (
        <ElementCard
          key={el.id}
          element={el}
          onEdit={() => onEdit(el)}
          onDelete={() => onDelete(el.id)}
          onOpen={() => onOpen?.(el.id)}
        />
      ))}
    </div>
  );
}
