import type { KeyValuePair } from "../types";

type PairTableProps = {
  title: string;
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
};

export function PairTable({ title, rows, onChange }: PairTableProps) {
  const updateRow = (id: string, field: keyof KeyValuePair, value: string | boolean) => {
    onChange(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    onChange([...rows, { id: crypto.randomUUID(), key: "", value: "", enabled: true }]);
  };

  const removeRow = (id: string) => {
    onChange(rows.filter((row) => row.id !== id));
  };

  return (
    <section className="panel">
      <div className="section-header">
        <h3>{title}</h3>
        <button className="ghost-button" onClick={addRow} type="button">
          Add Row
        </button>
      </div>
      <div className="pair-table">
        {rows.map((row) => (
          <div className="pair-row" key={row.id}>
            <label className="toggle">
              <input
                checked={row.enabled}
                onChange={(event) => updateRow(row.id, "enabled", event.target.checked)}
                type="checkbox"
              />
            </label>
            <input
              onChange={(event) => updateRow(row.id, "key", event.target.value)}
              placeholder="Key"
              value={row.key}
            />
            <input
              onChange={(event) => updateRow(row.id, "value", event.target.value)}
              placeholder="Value"
              value={row.value}
            />
            <button className="ghost-button danger" onClick={() => removeRow(row.id)} type="button">
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
