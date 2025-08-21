import { API_BASE_URL } from "@/config/env";
import type { paths as servicePaths } from "@/types/api-schema/index.d";
import createClient, { type Middleware } from "openapi-fetch";

// create clients
export const apiClient = createClient<servicePaths>({
  baseUrl: API_BASE_URL,
});

// middleware
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    return request;
  },
  async onResponse({ response }) {
    const { body, ...resOptions } = response;

    if (!response.ok) {
      const errorData = await response.json();
      return Promise.reject({
        error: errorData.error,
        message: errorData.error,
        status: response.status,
        code: errorData.code,
      });
    }

    return new Response(body, { ...resOptions });
  },
};

// create middleware
export const apiMiddleware = () => {
  apiClient.use(authMiddleware);
  return apiClient;
};

export const API_CLIENT = apiMiddleware();
