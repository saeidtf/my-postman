import type {
  ApiRequestDefinition,
  EnvironmentVariable,
  ExecutionResponse,
  RequestHistoryEntry
} from "../types";

const apiBaseUrl = "http://localhost:3001/api";

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok && response.status !== 204) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const api = {
  async listRequests() {
    return parseJson<ApiRequestDefinition[]>(await fetch(`${apiBaseUrl}/requests`));
  },
  async saveRequest(payload: ApiRequestDefinition) {
    const target = payload.id ? `${apiBaseUrl}/requests/${payload.id}` : `${apiBaseUrl}/requests`;
    const method = payload.id ? "PUT" : "POST";

    return parseJson<ApiRequestDefinition>(
      await fetch(target, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
    );
  },
  async deleteRequest(id: number) {
    return parseJson<void>(
      await fetch(`${apiBaseUrl}/requests/${id}`, {
        method: "DELETE"
      })
    );
  },
  async runRequest(payload: ApiRequestDefinition) {
    return parseJson<ExecutionResponse>(
      await fetch(`${apiBaseUrl}/executor/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
    );
  },
  async listHistory() {
    return parseJson<RequestHistoryEntry[]>(await fetch(`${apiBaseUrl}/history`));
  },
  async listEnvironment() {
    return parseJson<EnvironmentVariable[]>(await fetch(`${apiBaseUrl}/environment`));
  },
  async saveEnvironment(payload: EnvironmentVariable) {
    return parseJson<EnvironmentVariable>(
      await fetch(`${apiBaseUrl}/environment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
    );
  },
  async deleteEnvironment(id: number) {
    return parseJson<void>(
      await fetch(`${apiBaseUrl}/environment/${id}`, {
        method: "DELETE"
      })
    );
  }
};
