import { db } from "./database.js";

export const runMigrations = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      method TEXT NOT NULL,
      url TEXT NOT NULL,
      collection_name TEXT NOT NULL,
      timeout_ms INTEGER NOT NULL DEFAULT 30000,
      query_params TEXT NOT NULL,
      headers TEXT NOT NULL,
      auth_type TEXT NOT NULL,
      auth_config TEXT NOT NULL,
      body_type TEXT NOT NULL,
      body_content TEXT NOT NULL,
      body_entries TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS request_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER,
      request_name TEXT NOT NULL,
      method TEXT NOT NULL,
      url TEXT NOT NULL,
      request_snapshot TEXT NOT NULL,
      status INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      response_headers TEXT NOT NULL,
      response_body TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS environment_variables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
};
