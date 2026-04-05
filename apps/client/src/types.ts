export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type AuthType = "none" | "basic" | "bearer" | "api-key";
export type BodyType = "none" | "json" | "text" | "form-urlencoded" | "form-data";
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type ApiRequestDefinition = {
  id?: number;
  name: string;
  method: HttpMethod;
  url: string;
  collection: string;
  timeoutMs: number;
  queryParams: KeyValuePair[];
  headers: KeyValuePair[];
  authType: AuthType;
  authConfig: Record<string, string>;
  bodyType: BodyType;
  bodyContent: string;
  bodyEntries: KeyValuePair[];
  createdAt?: string;
  updatedAt?: string;
};

export type ExecutionResponse = {
  success: boolean;
  status: number;
  statusText: string;
  durationMs: number;
  size: number;
  headers: Record<string, string>;
  data: string;
};

export type EnvironmentVariable = {
  id?: number;
  key: string;
  value: string;
};

export type RequestHistoryEntry = {
  id: number;
  requestId: number | null;
  requestName: string;
  method: HttpMethod;
  url: string;
  status: number;
  durationMs: number;
  createdAt: string;
};
