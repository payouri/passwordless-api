import { FastifyInstance } from "fastify";
import { PublicRouter } from "./public";

export const mountAppRouters = (app: FastifyInstance) => {
  // app.register(PublicRouter);
  PublicRouter(app);

  return app;
};

export default mountAppRouters;
