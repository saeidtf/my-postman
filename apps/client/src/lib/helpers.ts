import type { ApiRequestDefinition, KeyValuePair } from "../types";

export const createPair = (): KeyValuePair => ({
  id: crypto.randomUUID(),
  key: "",
  value: "",
  enabled: true
});

export const createEmptyRequest = (): ApiRequestDefinition => ({
  name: "New Request",
  method: "GET",
  url: "http://localhost:8000",
  collection: "Default",
  timeoutMs: 30000,
  queryParams: [],
  headers: [],
  authType: "none",
  authConfig: {},
  bodyType: "none",
  bodyContent: "",
  bodyEntries: [createPair()]
});
