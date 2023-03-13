import { FastifyInstance, RouteOptions } from "fastify";

export const createFastifyRouter =
  (mountPoint: string, routesMap: Record<string, RouteOptions>) =>
  (fastify: FastifyInstance) => {
    const routes = Object.values(routesMap);
    fastify.register(
      (app, _, done) => {
        routes.forEach((route) => {
          app.route(route);
        });

        done();
      },
      { prefix: mountPoint }
    );
  };
