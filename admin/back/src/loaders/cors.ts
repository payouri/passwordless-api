import { fastifyCors } from "@fastify/cors";
import { FastifyInstance } from "fastify";

export const cors = (app: FastifyInstance) => {
  if (process.env.NODE_ENV === "development") {
    app.register(fastifyCors, {
      origin: (origin, cb) => {
        console.log(origin);

        cb(null, true);
      },
      credentials: true,
    });
  } else {
    app.register(fastifyCors, {
      origin: true,
      credentials: true,
    });
  }
};
