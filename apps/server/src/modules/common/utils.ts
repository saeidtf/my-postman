import { randomUUID } from "node:crypto";

import type { KeyValuePair } from "../../types.js";

export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const normalizePairs = (pairs: KeyValuePair[] = []): KeyValuePair[] =>
  pairs.map((pair) => ({
    id: pair.id || randomUUID(),
    key: pair.key ?? "",
    value: pair.value ?? "",
    enabled: pair.enabled ?? true
  }));

export const nowIso = () => new Date().toISOString();

export const serializeBodySize = (payload: string) => Buffer.byteLength(payload, "utf8");
