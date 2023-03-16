import { fastify } from "fastify";
import { PORT } from "./config.js";
import { initModels } from "./entities/index.js";
import { connectToMongo } from "./mongo.js";
import { PublicRouter } from "./router/public/index.js";

const server = fastify({
  logger: true,
});

PublicRouter(server);

const startServer = async () => {
  try {
    const connection = await connectToMongo();

    await initModels(connection);

    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export { server, startServer };

startServer();
