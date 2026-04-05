import { runMigrations } from "./db/migrate.js";
import { buildApp } from "./app.js";

const start = async () => {
  runMigrations();

  const app = await buildApp();

  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3001
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
