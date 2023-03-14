import { fastify } from "fastify";
import { PORT } from "./config.js";
import { DomainModel } from "./entities/Domain/Domain.model.js";
import { PublicRouter } from "./router/public/index.js";

const a = DomainModel;

const server = fastify({
  logger: true,
});

PublicRouter(server);

const startServer = async () => {
  try {
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export { server, startServer };

startServer();
