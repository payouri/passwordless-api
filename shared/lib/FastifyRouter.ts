import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  RouteOptions,
} from "fastify";
import { initRequestContext } from "./RequestContext/index.js";

export const createFastifyRouter =
  ({
    middlewares,
    mountPoint,
    routesMap,
  }: {
    middlewares?: FastifyPluginAsync<FastifyPluginOptions>[];
    mountPoint: string;
    routesMap: Record<string, RouteOptions>;
  }) =>
  (fastify: FastifyInstance) => {
    const routes = Object.values(routesMap);

    fastify.register(
      (app, _, done) => {
        initRequestContext(app);

        middlewares?.forEach((middleware) => {
          middleware(app, _);
        });

        routes.forEach((route) => {
          app.route(route);
        });

        done();
      },
      { prefix: mountPoint }
    );
  };
