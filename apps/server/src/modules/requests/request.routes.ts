import type { FastifyInstance } from "fastify";

import { requestSchema } from "../common/validation.js";
import { ExecutorService } from "../executor/executor.service.js";
import { HistoryRepository } from "../history/history.repository.js";
import { RequestService } from "./request.service.js";

const requestService = new RequestService();
const executorService = new ExecutorService();
const historyRepository = new HistoryRepository();

export const registerRequestRoutes = async (app: FastifyInstance) => {
  app.get("/api/requests", async () => requestService.list());

  app.get<{ Params: { id: string } }>("/api/requests/:id", async (request, reply) => {
    const item = requestService.get(Number(request.params.id));

    if (!item) {
      return reply.status(404).send({ message: "Request not found" });
    }

    return item;
  });

  app.post("/api/requests", async (request, reply) => {
    const parsed = requestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ message: parsed.error.flatten() });
    }

    return reply.status(201).send(requestService.create(parsed.data));
  });

  app.put<{ Params: { id: string } }>("/api/requests/:id", async (request, reply) => {
    const parsed = requestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ message: parsed.error.flatten() });
    }

    const updated = requestService.update(Number(request.params.id), parsed.data);

    if (!updated) {
      return reply.status(404).send({ message: "Request not found" });
    }

    return updated;
  });

  app.delete<{ Params: { id: string } }>("/api/requests/:id", async (request, reply) => {
    requestService.delete(Number(request.params.id));
    return reply.status(204).send();
  });

  app.post<{ Params: { id: string } }>("/api/requests/:id/run", async (request, reply) => {
    const item = requestService.get(Number(request.params.id));

    if (!item) {
      return reply.status(404).send({ message: "Request not found" });
    }

    const response = await executorService.run(item);
    historyRepository.create(item, response);
    return response;
  });

  app.post("/api/executor/run", async (request, reply) => {
    const parsed = requestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ message: parsed.error.flatten() });
    }

    const hydrated = requestService.hydrateForExecution(parsed.data);
    const response = await executorService.run(hydrated);
    historyRepository.create(hydrated, response);
    return response;
  });
};
