import type { FastifyInstance } from "fastify";

import { environmentSchema } from "../common/validation.js";
import { EnvironmentRepository } from "./environment.repository.js";

const repository = new EnvironmentRepository();

export const registerEnvironmentRoutes = async (app: FastifyInstance) => {
  app.get("/api/environment", async () => repository.list());

  app.post("/api/environment", async (request, reply) => {
    const parsed = environmentSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ message: parsed.error.flatten() });
    }

    return repository.upsert(parsed.data);
  });

  app.delete<{ Params: { id: string } }>("/api/environment/:id", async (request, reply) => {
    repository.delete(Number(request.params.id));
    return reply.status(204).send();
  });
};
