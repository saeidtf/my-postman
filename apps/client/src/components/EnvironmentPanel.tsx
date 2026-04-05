import { useState } from "react";

import type { EnvironmentVariable } from "../types";

type EnvironmentPanelProps = {
  items: EnvironmentVariable[];
  onSave: (payload: EnvironmentVariable) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function EnvironmentPanel({
  items,
  onSave,
  onDelete,
}: EnvironmentPanelProps) {
  const [draft, setDraft] = useState<EnvironmentVariable>({
    key: "",
    value: "",
  });

  return (
    <section className="panel">
      <div className="section-header">
        <h3>Environment Variables</h3>
      </div>
      <div className="environment-form">
        <input
          onChange={(event) =>
            setDraft((current) => ({ ...current, key: event.target.value }))
          }
          placeholder="Key"
          value={draft.key}
        />
        <input
          onChange={(event) =>
            setDraft((current) => ({ ...current, value: event.target.value }))
          }
          placeholder="Value"
          value={draft.value}
        />
        <button
          className="primary-button"
          onClick={async () => {
            await onSave(draft);
            setDraft({ key: "", value: "" });
          }}
          type="button"
        >
          Save Variable
        </button>
      </div>
      <div className="environment-list">
        {items.map((item) => (
          <div className="environment-row" key={item.id}>
            <div className="environment-row-content">
              <strong>{item.key}</strong>
              <small>{item.value}</small>
            </div>
            <button
              className="ghost-button danger"
              onClick={() => onDelete(item.id!)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
