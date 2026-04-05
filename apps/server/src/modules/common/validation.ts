import { z } from "zod";

const keyValueSchema = z.object({
  id: z.string().min(1),
  key: z.string(),
  value: z.string(),
  enabled: z.boolean()
});

export const requestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]),
  url: z.string().url("A valid URL is required"),
  collection: z.string().default("Default"),
  timeoutMs: z.number().int().positive().max(120000).default(30000),
  queryParams: z.array(keyValueSchema).default([]),
  headers: z.array(keyValueSchema).default([]),
  authType: z.enum(["none", "basic", "bearer", "api-key"]).default("none"),
  authConfig: z.record(z.string()).default({}),
  bodyType: z.enum(["none", "json", "text", "form-urlencoded", "form-data"]).default("none"),
  bodyContent: z.string().default(""),
  bodyEntries: z.array(keyValueSchema).default([])
});

export const environmentSchema = z.object({
  key: z.string().min(1, "Variable key is required"),
  value: z.string()
});
