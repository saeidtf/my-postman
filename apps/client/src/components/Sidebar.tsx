import { useState } from "react";
import type { ApiRequestDefinition, RequestHistoryEntry } from "../types";

type SidebarProps = {
  items: ApiRequestDefinition[];
  selectedId?: number;
  history: RequestHistoryEntry[];
  onCreate: () => void;
  onSelect: (item: ApiRequestDefinition) => void;
};

export function Sidebar({
  items,
  selectedId,
  history,
  onCreate,
  onSelect,
}: SidebarProps) {
  const [openCollections, setOpenCollections] = useState<
    Record<string, boolean>
  >({});

  const toggleCollection = (collection: string) => {
    setOpenCollections((prev) => ({
      ...prev,
      [collection]: !prev[collection],
    }));
  };

  const groupedByCollection = (items ?? []).reduce(
    (acc, item) => {
      const rawKey = item.collection?.trim() || "Uncategorized";
      const key = rawKey.toLowerCase();

      if (!acc[key]) {
        acc[key] = {
          label: rawKey,
          items: [],
        };
      }

      acc[key].items.push(item);

      return acc;
    },
    {} as Record<string, { label: string; items: ApiRequestDefinition[] }>,
  );

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="eyebrow">API Workbench</p>
        <h1>My Postman</h1>
        <p className="muted">
          Request builder, environment variables and execution history in one
          workspace.
        </p>
      </div>

      <button
        className="primary-button full-width"
        onClick={onCreate}
        type="button"
      >
        New Request
      </button>

      <section className="sidebar-section">
        <div className="section-header">
          <h2>Saved Requests</h2>
          <span>{items.length}</span>
        </div>

        <div className="request-list">
          {Object.entries(groupedByCollection).map(([key, group]) => {
            const isOpen = openCollections[key] ?? true;

            return (
              <div key={key} className="collection-group">
                <button
                  type="button"
                  className="collection-title"
                  onClick={() => toggleCollection(key)}
                >
                  <strong>{group.label}</strong>

                  <span>
                    {group.items.length} {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && (
                  <div className="collection-items">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        className={`request-card ${
                          item.id === selectedId ? "active" : ""
                        }`}
                        onClick={() => onSelect(item)}
                      >
                        <span
                          className={`method-badge method-${item.method.toLowerCase()}`}
                        >
                          {item.method}
                        </span>

                        <strong>{item.name}</strong>
                        <small>{item.url}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="sidebar-section">
        <div className="section-header">
          <h2>Recent Runs</h2>
        </div>
        <div className="history-list">
          {history.map((entry) => (
            <div className="history-box" key={entry.id}>
              <span
                className={`status-dot ${entry.status < 400 ? "ok" : "fail"}`}
              />
              <div className="history-box-info">
                <strong>{entry.requestName}</strong>
                <small>
                  {entry.status} • {entry.durationMs} ms
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
