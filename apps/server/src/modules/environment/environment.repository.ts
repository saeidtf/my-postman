import { db } from "../../db/database.js";
import { nowIso } from "../common/utils.js";
import type { EnvironmentVariable } from "../../types.js";

export class EnvironmentRepository {
  list(): EnvironmentVariable[] {
    return db
      .prepare(
        `SELECT id, key, value, created_at AS createdAt, updated_at AS updatedAt
         FROM environment_variables
         ORDER BY key ASC`
      )
      .all() as EnvironmentVariable[];
  }

  upsert(input: EnvironmentVariable): EnvironmentVariable {
    const now = nowIso();

    db.prepare(
      `INSERT INTO environment_variables (key, value, created_at, updated_at)
       VALUES (@key, @value, @createdAt, @updatedAt)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    ).run({
      key: input.key,
      value: input.value,
      createdAt: now,
      updatedAt: now
    });

    return db
      .prepare(
        `SELECT id, key, value, created_at AS createdAt, updated_at AS updatedAt
         FROM environment_variables
         WHERE key = ?`
      )
      .get(input.key) as EnvironmentVariable;
  }

  delete(id: number) {
    db.prepare("DELETE FROM environment_variables WHERE id = ?").run(id);
  }
}
