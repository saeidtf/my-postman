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
          {items.map((item) => (
            <button
              className={`request-card ${item.id === selectedId ? "active" : ""}`}
              key={item.id}
              onClick={() => onSelect(item)}
              type="button"
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
