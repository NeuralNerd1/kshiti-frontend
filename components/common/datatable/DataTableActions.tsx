"use client";

import SearchInput from "./SearchInput";
import StatusFilter, {
  StatusFilterValue,
} from "./StatusFilter";
import ColumnSelector from "./ColumnSelector";

export default function DataTableActions({
  search,
  onSearchChange,
  status,
  onStatusChange,
  columns,
  onToggleColumn,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilterValue;
  onStatusChange: (v: StatusFilterValue) => void;
  columns: Record<string, boolean>;
  onToggleColumn: (key: string) => void;
}) {
  return (
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    padding: "0 8px",   // ⬅ aligns with table padding
  }}
>

      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by email…"
      />

      <div style={{ display: "flex", gap: 12 }}>
        <StatusFilter
          value={status}
          onChange={onStatusChange}
        />
        <ColumnSelector
          columns={columns}
          onToggle={onToggleColumn}
        />
      </div>
    </div>
  );
}
