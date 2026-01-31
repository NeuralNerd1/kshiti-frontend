/* =========================
   SIDEBAR
========================= */

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar__brand {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar__logo-placeholder {
  height: 36px;
  border-radius: 6px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
}

.sidebar__nav {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* =========================
   SIDEBAR ITEM
========================= */

.sidebar-item {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
}

.sidebar-item--active {
  background-color: #eef2ff;
  color: #1d4ed8;
  font-weight: 500;
}

.sidebar-item--disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.sidebar-item__label {
  flex: 1;
}

