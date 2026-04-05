import { db } from "../../db/database.js";
import type { ApiRequestDefinition, ExecutionResponse, RequestHistoryEntry } from "../../types.js";

type HistoryRow = {
  id: number;
  request_id: number | null;
  request_name: string;
  method: RequestHistoryEntry["method"];
  url: string;
  status: number;
  duration_ms: number;
  created_at: string;
};

export class HistoryRepository {
  create(request: ApiRequestDefinition, response: ExecutionResponse) {
    db.prepare(
      `INSERT INTO request_history (
        request_id, request_name, method, url, request_snapshot, status,
        duration_ms, response_headers, response_body, size, created_at
      ) VALUES (
        @requestId, @requestName, @method, @url, @requestSnapshot, @status,
        @durationMs, @responseHeaders, @responseBody, @size, @createdAt
      )`
    ).run({
      requestId: request.id ?? null,
      requestName: request.name,
      method: request.method,
      url: request.url,
      requestSnapshot: JSON.stringify(request),
      status: response.status,
      durationMs: response.durationMs,
      responseHeaders: JSON.stringify(response.headers),
      responseBody: response.data,
      size: response.size,
      createdAt: new Date().toISOString()
    });
  }

  list(): RequestHistoryEntry[] {
    return db
      .prepare(
        `SELECT id, request_id AS requestId, request_name AS requestName, method, url, status,
          duration_ms AS durationMs, created_at AS createdAt
         FROM request_history
         ORDER BY id DESC
         LIMIT 50`
      )
      .all() as RequestHistoryEntry[];
  }
}
