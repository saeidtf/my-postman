import type { FastifyInstance } from "fastify";

import { HistoryRepository } from "./history.repository.js";

const repository = new HistoryRepository();

export const registerHistoryRoutes = async (app: FastifyInstance) => {
  app.get("/api/history", async () => repository.list());
};
