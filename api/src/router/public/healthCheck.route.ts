import { RouteOptions } from "fastify";

export const healthCheckRoute: RouteOptions = {
  method: "GET",
  url: "/health-check",
  handler: async () => {
    return { status: "OK" };
  },
};
