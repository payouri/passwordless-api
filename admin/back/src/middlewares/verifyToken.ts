import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { Schema } from "zod";
import { getErrorMessage } from "../../../../shared/helpers/index.js";
import {
  getRequestContext,
  setRequestContext,
} from "../../../../shared/lib/RequestContext/index.js";
import { getJWTManager } from "../lib/JWT/index.js";

export const verifyToken =
  (schema?: Schema): FastifyPluginAsync<FastifyPluginOptions> =>
  async (fastify) => {
    fastify.addHook("onRequest", async (request, reply) => {
      const [, token] = request.headers.authorization?.split(" ") || [];
      if (!token) {
        reply.code(401).send({ message: "Unauthorized" });
        return;
      }
      try {
        const decoded = await (
          await getJWTManager()
        ).decode({
          token,
        });

        if (decoded.hasFailed) {
          console.error(decoded.error);
          reply.code(401).send({ message: "Unauthorized" });
          return;
        }

        const isValidToken = await schema?.safeParseAsync(decoded.data);

        if (typeof isValidToken !== "undefined" && !isValidToken.success) {
          console.error(isValidToken.error);
          reply.code(401).send({ message: "Unauthorized" });
          return;
        }

        setRequestContext({
          request,
          context: {
            decodedToken: {
              ...decoded.data,
              ...decoded.protectedHeader,
            },
            token,
          },
        });
      } catch (err) {
        console.error(getErrorMessage(err));
        reply.code(500).send({ message: "Unexpected Error" });
      }
    });
  };
