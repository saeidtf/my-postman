import type { ExecutionResponse } from "../types";

type ResponsePanelProps = {
  response: ExecutionResponse | null;
};

export function ResponsePanel({ response }: ResponsePanelProps) {
  return (
    <section className="panel response-panel">
      <div className="section-header">
        <h3>Response</h3>
        {response ? (
          <div className="response-meta">
            <span className={response.success ? "pill success" : "pill danger"}>{response.status}</span>
            <span>{response.durationMs} ms</span>
            <span>{response.size} bytes</span>
          </div>
        ) : null}
      </div>
      {response ? (
        <div className="response-grid">
          <div className="response-box">
            <h4>Body</h4>
            <pre className="response-box-body">{response.data}</pre>
          </div>
          <div className="response-box">
            <h4>Headers</h4>
            <pre>{JSON.stringify(response.headers, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <div className="placeholder">Run a request to inspect the response body, headers, status and timing.</div>
      )}
    </section>
  );
}
