import { db } from "../../db/database.js";
import type { ApiRequestDefinition } from "../../types.js";
import { normalizePairs, nowIso, safeJsonParse } from "../common/utils.js";

type RequestRow = {
  id: number;
  name: string;
  method: ApiRequestDefinition["method"];
  url: string;
  collection_name: string;
  timeout_ms: number;
  query_params: string;
  headers: string;
  auth_type: ApiRequestDefinition["authType"];
  auth_config: string;
  body_type: ApiRequestDefinition["bodyType"];
  body_content: string;
  body_entries: string;
  created_at: string;
  updated_at: string;
};

const mapRow = (row: RequestRow): ApiRequestDefinition => ({
  id: row.id,
  name: row.name,
  method: row.method,
  url: row.url,
  collection: row.collection_name,
  timeoutMs: row.timeout_ms,
  queryParams: normalizePairs(safeJsonParse(row.query_params, [])),
  headers: normalizePairs(safeJsonParse(row.headers, [])),
  authType: row.auth_type,
  authConfig: safeJsonParse(row.auth_config, {}),
  bodyType: row.body_type,
  bodyContent: row.body_content,
  bodyEntries: normalizePairs(safeJsonParse(row.body_entries, [])),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export class RequestRepository {
  list(): ApiRequestDefinition[] {
    const rows = db
      .prepare("SELECT * FROM requests ORDER BY updated_at DESC, id DESC")
      .all() as RequestRow[];
    return rows.map(mapRow);
  }

  getById(id: number): ApiRequestDefinition | null {
    const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id) as RequestRow | undefined;
    return row ? mapRow(row) : null;
  }

  create(input: ApiRequestDefinition): ApiRequestDefinition {
    const now = nowIso();
    const result = db
      .prepare(
        `INSERT INTO requests (
          name, method, url, collection_name, timeout_ms, query_params, headers,
          auth_type, auth_config, body_type, body_content, body_entries, created_at, updated_at
        ) VALUES (
          @name, @method, @url, @collection, @timeoutMs, @queryParams, @headers,
          @authType, @authConfig, @bodyType, @bodyContent, @bodyEntries, @createdAt, @updatedAt
        )`
      )
      .run({
        name: input.name,
        method: input.method,
        url: input.url,
        collection: input.collection,
        timeoutMs: input.timeoutMs,
        queryParams: JSON.stringify(normalizePairs(input.queryParams)),
        headers: JSON.stringify(normalizePairs(input.headers)),
        authType: input.authType,
        authConfig: JSON.stringify(input.authConfig),
        bodyType: input.bodyType,
        bodyContent: input.bodyContent,
        bodyEntries: JSON.stringify(normalizePairs(input.bodyEntries)),
        createdAt: now,
        updatedAt: now
      });

    return this.getById(Number(result.lastInsertRowid))!;
  }

  update(id: number, input: ApiRequestDefinition): ApiRequestDefinition | null {
    const now = nowIso();

    db.prepare(
      `UPDATE requests SET
        name = @name,
        method = @method,
        url = @url,
        collection_name = @collection,
        timeout_ms = @timeoutMs,
        query_params = @queryParams,
        headers = @headers,
        auth_type = @authType,
        auth_config = @authConfig,
        body_type = @bodyType,
        body_content = @bodyContent,
        body_entries = @bodyEntries,
        updated_at = @updatedAt
       WHERE id = @id`
    ).run({
      id,
      name: input.name,
      method: input.method,
      url: input.url,
      collection: input.collection,
      timeoutMs: input.timeoutMs,
      queryParams: JSON.stringify(normalizePairs(input.queryParams)),
      headers: JSON.stringify(normalizePairs(input.headers)),
      authType: input.authType,
      authConfig: JSON.stringify(input.authConfig),
      bodyType: input.bodyType,
      bodyContent: input.bodyContent,
      bodyEntries: JSON.stringify(normalizePairs(input.bodyEntries)),
      updatedAt: now
    });

    return this.getById(id);
  }

  delete(id: number) {
    db.prepare("DELETE FROM requests WHERE id = ?").run(id);
  }
}
