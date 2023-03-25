// import "./registerAliases.js";
import { fastify } from "fastify";
import { PORT } from "./config.js";
import { cors } from "./loaders/cors.js";
import { initApp } from "./loaders/index.js";
import mountAppRouters from "./router/index.js";

const server = fastify({
  logger: true,
});

cors(server);
mountAppRouters(server);

const startServer = async () => {
  try {
    await initApp();

    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export { server, startServer };

startServer();
