import { useEffect, useState } from "react";

import { EnvironmentPanel } from "./components/EnvironmentPanel";
import { PairTable } from "./components/PairTable";
import { ResponsePanel } from "./components/ResponsePanel";
import { Sidebar } from "./components/Sidebar";
import { api } from "./lib/api";
import { createEmptyRequest } from "./lib/helpers";
import type {
  ApiRequestDefinition,
  AuthType,
  BodyType,
  EnvironmentVariable,
  ExecutionResponse,
  RequestHistoryEntry,
} from "./types";

const bodyModes: BodyType[] = [
  "none",
  "json",
  "text",
  "form-urlencoded",
  "form-data",
];
const authModes: AuthType[] = ["none", "bearer", "basic", "api-key"];

function App() {
  const [requests, setRequests] = useState<ApiRequestDefinition[]>([]);
  const [currentRequest, setCurrentRequest] =
    useState<ApiRequestDefinition>(createEmptyRequest());
  const [response, setResponse] = useState<ExecutionResponse | null>(null);
  const [history, setHistory] = useState<RequestHistoryEntry[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentVariable[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAll = async () => {
    try {
      const [requestData, historyData, environmentData] = await Promise.all([
        api.listRequests(),
        api.listHistory(),
        api.listEnvironment(),
      ]);

      setRequests(requestData);
      setHistory(historyData);
      setEnvironment(environmentData);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load data",
      );
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const saveRequest = async () => {
    try {
      const saved = await api.saveRequest(currentRequest);
      setCurrentRequest(saved);
      setErrorMessage("");
      await loadAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save request",
      );
    }
  };

  const runRequest = async () => {
    setIsRunning(true);

    try {
      const result = await api.runRequest(currentRequest);
      setResponse(result);
      setErrorMessage("");
      await loadAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to execute request",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        history={history}
        items={requests}
        onCreate={() => {
          setCurrentRequest(createEmptyRequest());
          setResponse(null);
        }}
        onSelect={(item) => {
          setCurrentRequest(item);
          setResponse(null);
        }}
        selectedId={currentRequest.id}
      />

      <main className="workspace">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Request Composer</p>
            <h2>Design, store and run HTTP requests with persistent history</h2>
            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
          </div>
          <div className="action-row">
          <button
              className="primary-button"
              disabled={isRunning}
              onClick={runRequest}
              type="button"
            >
              {isRunning ? "Sending..." : "Send Request"}
            </button>
            <button
              className="ghost-button"
              onClick={saveRequest}
              type="button"
            >
              Save Request
            </button>            
            {currentRequest.id ? (
              <button
                className="ghost-button danger"
                onClick={async () => {
                  try {
                    await api.deleteRequest(currentRequest.id!);
                    setCurrentRequest(createEmptyRequest());
                    setResponse(null);
                    setErrorMessage("");
                    await loadAll();
                  } catch (error) {
                    setErrorMessage(
                      error instanceof Error
                        ? error.message
                        : "Unable to delete request",
                    );
                  }
                }}
                type="button"
              >
                Delete
              </button>
            ) : null}
          </div>
        </section>

        <section className="panel request-editor">
          <div className="editor-top-grid">
            <input
              onChange={(event) =>
                setCurrentRequest((item) => ({
                  ...item,
                  name: event.target.value,
                }))
              }
              placeholder="Request name"
              value={currentRequest.name}
            />
            <input
              onChange={(event) =>
                setCurrentRequest((item) => ({
                  ...item,
                  collection: event.target.value,
                }))
              }
              placeholder="Collection"
              value={currentRequest.collection}
            />
            <input
              onChange={(event) =>
                setCurrentRequest((item) => ({
                  ...item,
                  timeoutMs: Number(event.target.value) || 30000,
                }))
              }
              placeholder="Timeout"
              type="number"
              value={currentRequest.timeoutMs}
            />
          </div>

          <div className="request-bar">
            <select
              onChange={(event) =>
                setCurrentRequest((item) => ({
                  ...item,
                  method: event.target.value as ApiRequestDefinition["method"],
                }))
              }
              value={currentRequest.method}
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map(
                (method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ),
              )}
            </select>
            <input
              className="url-input"
              onChange={(event) =>
                setCurrentRequest((item) => ({
                  ...item,
                  url: event.target.value,
                }))
              }
              placeholder="https://api.example.com/resource"
              value={currentRequest.url}
            />
          </div>

          <div className="section-flex">
            <PairTable
              onChange={(rows) =>
                setCurrentRequest((item) => ({ ...item, queryParams: rows }))
              }
              rows={currentRequest.queryParams}
              title="Query Params"
            />

            <PairTable
              onChange={(rows) =>
                setCurrentRequest((item) => ({ ...item, headers: rows }))
              }
              rows={currentRequest.headers}
              title="Headers"
            />
          </div>

          <section className="panel nested">
            <div className="section-header">
              <h3>Authorization</h3>
            </div>
            <div className="auth-grid">
              <select
                onChange={(event) =>
                  setCurrentRequest((item) => ({
                    ...item,
                    authType: event.target.value as AuthType,
                    authConfig: {},
                  }))
                }
                value={currentRequest.authType}
              >
                {authModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>

              {currentRequest.authType === "bearer" ? (
                <input
                  onChange={(event) =>
                    setCurrentRequest((item) => ({
                      ...item,
                      authConfig: {
                        ...item.authConfig,
                        token: event.target.value,
                      },
                    }))
                  }
                  placeholder="Bearer token"
                  value={currentRequest.authConfig.token ?? ""}
                />
              ) : null}

              {currentRequest.authType === "basic" ? (
                <>
                  <input
                    onChange={(event) =>
                      setCurrentRequest((item) => ({
                        ...item,
                        authConfig: {
                          ...item.authConfig,
                          username: event.target.value,
                        },
                      }))
                    }
                    placeholder="Username"
                    value={currentRequest.authConfig.username ?? ""}
                  />
                  <input
                    onChange={(event) =>
                      setCurrentRequest((item) => ({
                        ...item,
                        authConfig: {
                          ...item.authConfig,
                          password: event.target.value,
                        },
                      }))
                    }
                    placeholder="Password"
                    type="password"
                    value={currentRequest.authConfig.password ?? ""}
                  />
                </>
              ) : null}

              {currentRequest.authType === "api-key" ? (
                <>
                  <input
                    onChange={(event) =>
                      setCurrentRequest((item) => ({
                        ...item,
                        authConfig: {
                          ...item.authConfig,
                          key: event.target.value,
                        },
                      }))
                    }
                    placeholder="Key"
                    value={currentRequest.authConfig.key ?? ""}
                  />
                  <input
                    onChange={(event) =>
                      setCurrentRequest((item) => ({
                        ...item,
                        authConfig: {
                          ...item.authConfig,
                          value: event.target.value,
                        },
                      }))
                    }
                    placeholder="Value"
                    value={currentRequest.authConfig.value ?? ""}
                  />
                  <select
                    onChange={(event) =>
                      setCurrentRequest((item) => ({
                        ...item,
                        authConfig: {
                          ...item.authConfig,
                          location: event.target.value,
                        },
                      }))
                    }
                    value={currentRequest.authConfig.location ?? "header"}
                  >
                    <option value="header">Header</option>
                    <option value="query">Query</option>
                  </select>
                </>
              ) : null}
            </div>
          </section>

          <section className="panel nested">
            <div className="section-header">
              <h3>Body</h3>
            </div>
            <div className="body-mode-bar">
              {bodyModes.map((mode) => (
                <button
                  className={`tab-button ${currentRequest.bodyType === mode ? "active" : ""}`}
                  key={mode}
                  onClick={() =>
                    setCurrentRequest((item) => ({ ...item, bodyType: mode }))
                  }
                  type="button"
                >
                  {mode}
                </button>
              ))}
            </div>

            {currentRequest.bodyType === "json" ||
            currentRequest.bodyType === "text" ? (
              <textarea
                onChange={(event) =>
                  setCurrentRequest((item) => ({
                    ...item,
                    bodyContent: event.target.value,
                  }))
                }
                placeholder="Request body"
                rows={10}
                value={currentRequest.bodyContent}
              />
            ) : null}

            {currentRequest.bodyType === "form-urlencoded" ||
            currentRequest.bodyType === "form-data" ? (
              <PairTable
                onChange={(rows) =>
                  setCurrentRequest((item) => ({ ...item, bodyEntries: rows }))
                }
                rows={currentRequest.bodyEntries}
                title="Body Entries"
              />
            ) : null}
          </section>
        </section>

        <EnvironmentPanel
          items={environment}
          onDelete={async (id) => {
            try {
              await api.deleteEnvironment(id);
              setErrorMessage("");
              await loadAll();
            } catch (error) {
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : "Unable to delete variable",
              );
            }
          }}
          onSave={async (payload) => {
            try {
              await api.saveEnvironment(payload);
              setErrorMessage("");
              await loadAll();
            } catch (error) {
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : "Unable to save variable",
              );
            }
          }}
        />

        <ResponsePanel response={response} />
      </main>
    </div>
  );
}

export default App;
