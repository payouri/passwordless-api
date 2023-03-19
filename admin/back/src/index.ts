// import "./registerAliases.js";
import { fastify } from "fastify";
import { PORT } from "./config.js";
import { initApp } from "./loaders/index.js";

const server = fastify({
  logger: true,
});

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
