import { RouteOptions } from "fastify";
import { getAuthControllers } from "../../controllers/authorization/index.js";

export const getAuthData: RouteOptions = {
  method: "GET",
  url: "/authenticate",
  handler: async (request, reply) => {
    console.log(request.hostname);
    return getAuthControllers().getAuthenticationData();
  },
};
