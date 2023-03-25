import {
  ContextConfigDefault,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RouteGenericInterface,
  RouteOptions,
} from "fastify";
import { AuthMethodType } from "../../services/AuthSession/types.js";
import { getUserAccountServices } from "../../services/UserAccount/UserAccount.services.js";
import { getRequestContext } from "../../../../../shared/lib/RequestContext/index.js";

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
    console.log(request.body);
    console.log(getRequestContext(request));

    reply.code(200).send({
      message: "OK",
    });
  },
};
