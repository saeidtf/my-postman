import axios, { AxiosError } from "axios";

import type { ApiRequestDefinition, ExecutionResponse, KeyValuePair } from "../../types.js";
import { serializeBodySize } from "../common/utils.js";

const enabledPairsToObject = (pairs: KeyValuePair[]) =>
  Object.fromEntries(
    pairs.filter((item) => item.enabled && item.key.trim()).map((item) => [item.key.trim(), item.value])
  );

export class ExecutorService {
  async run(input: ApiRequestDefinition): Promise<ExecutionResponse> {
    const headers = enabledPairsToObject(input.headers);
    const params = enabledPairsToObject(input.queryParams);

    if (input.authType === "bearer" && input.authConfig.token) {
      headers.Authorization = `Bearer ${input.authConfig.token}`;
    }

    if (input.authType === "api-key" && input.authConfig.key && input.authConfig.value) {
      const location = input.authConfig.location ?? "header";

      if (location === "query") {
        params[input.authConfig.key] = input.authConfig.value;
      } else {
        headers[input.authConfig.key] = input.authConfig.value;
      }
    }

    let data: URLSearchParams | FormData | string | undefined;

    if (input.bodyType === "json" && input.bodyContent.trim()) {
      headers["Content-Type"] ??= "application/json";
      data = input.bodyContent;
    }

    if (input.bodyType === "text") {
      headers["Content-Type"] ??= "text/plain";
      data = input.bodyContent;
    }

    if (input.bodyType === "form-urlencoded") {
      headers["Content-Type"] ??= "application/x-www-form-urlencoded";
      data = new URLSearchParams(enabledPairsToObject(input.bodyEntries));
    }

    if (input.bodyType === "form-data") {
      const formData = new FormData();

      input.bodyEntries
        .filter((item) => item.enabled && item.key.trim())
        .forEach((item) => formData.append(item.key, item.value));

      data = formData;
    }

    const start = performance.now();

    try {
      const response = await axios({
        method: input.method,
        url: input.url,
        params,
        headers,
        data,
        timeout: input.timeoutMs,
        auth:
          input.authType === "basic"
            ? {
                username: input.authConfig.username ?? "",
                password: input.authConfig.password ?? ""
              }
            : undefined,
        validateStatus: () => true,
        responseType: "text",
        transformResponse: [(value) => value]
      });

      const payload =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2);

      return {
        success: response.status < 400,
        status: response.status,
        statusText: response.statusText,
        durationMs: Math.round(performance.now() - start),
        size: serializeBodySize(payload),
        headers: Object.fromEntries(
          Object.entries(response.headers).map(([key, value]) => [key, String(value)])
        ),
        data: payload
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const payload = axiosError.message;

      return {
        success: false,
        status: 0,
        statusText: "NETWORK_ERROR",
        durationMs: Math.round(performance.now() - start),
        size: serializeBodySize(payload),
        headers: {},
        data: payload
      };
    }
  }
}
