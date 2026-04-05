import Fastify from "fastify";
import cors from "@fastify/cors";

import { registerEnvironmentRoutes } from "./modules/environment/environment.routes.js";
import { registerHistoryRoutes } from "./modules/history/history.routes.js";
import { registerRequestRoutes } from "./modules/requests/request.routes.js";

export const buildApp = async () => {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: true
  });

  app.get("/api/health", async () => ({ ok: true }));

  await registerRequestRoutes(app);
  await registerHistoryRoutes(app);
  await registerEnvironmentRoutes(app);

  return app;
};
