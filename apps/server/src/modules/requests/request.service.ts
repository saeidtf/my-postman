import { EnvironmentRepository } from "../environment/environment.repository.js";
import { RequestRepository } from "./request.repository.js";
import type { ApiRequestDefinition } from "../../types.js";

export class RequestService {
  constructor(
    private readonly repository = new RequestRepository(),
    private readonly environmentRepository = new EnvironmentRepository()
  ) {}

  list() {
    return this.repository.list();
  }

  get(id: number) {
    return this.repository.getById(id);
  }

  create(input: ApiRequestDefinition) {
    return this.repository.create(input);
  }

  update(id: number, input: ApiRequestDefinition) {
    return this.repository.update(id, input);
  }

  delete(id: number) {
    this.repository.delete(id);
  }

  hydrateForExecution(input: ApiRequestDefinition) {
    return this.resolveVariables(input);
  }

  private resolveVariables(input: ApiRequestDefinition): ApiRequestDefinition {
    const variables = new Map(this.environmentRepository.list().map((entry) => [entry.key, entry.value]));
    const apply = (value: string) =>
      value.replace(/\{\{(.*?)\}\}/g, (_, key: string) => variables.get(key.trim()) ?? `{{${key}}}`);

    return {
      ...input,
      url: apply(input.url),
      headers: input.headers.map((item) => ({ ...item, key: apply(item.key), value: apply(item.value) })),
      queryParams: input.queryParams.map((item) => ({ ...item, key: apply(item.key), value: apply(item.value) })),
      bodyContent: apply(input.bodyContent),
      bodyEntries: input.bodyEntries.map((item) => ({
        ...item,
        key: apply(item.key),
        value: apply(item.value)
      })),
      authConfig: Object.fromEntries(
        Object.entries(input.authConfig).map(([key, value]) => [key, apply(value)])
      )
    };
  }
}
