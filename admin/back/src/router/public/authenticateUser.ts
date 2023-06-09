import { RouteOptions } from "fastify";
import { AuthMethodType } from "../../services/AuthSession/types.js";
import { getUserAccountServices } from "../../services/UserAccount/UserAccount.services.js";

export const authenticateUser: RouteOptions = {
  method: "POST",
  url: "/authenticate",
  schema: {
    body: {
      type: "object",
      properties: {
        authType: { type: "string", enum: Object.values(AuthMethodType) },
        payload: { type: "string" },
      },
    },
  },
  handler: async (request, reply) => {
    getUserAccountServices();
  },
};
