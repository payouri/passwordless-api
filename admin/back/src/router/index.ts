import { FastifyInstance } from "fastify";
import { PrivateRouter } from "./private/index.js";
import { PublicRouter } from "./public/index.js";

export const mountAppRouters = (app: FastifyInstance) => {
  // app.register(PublicRouter);
  PrivateRouter(app);
  PublicRouter(app);

  return app;
};

export default mountAppRouters;
