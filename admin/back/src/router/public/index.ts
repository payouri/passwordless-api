import { createFastifyRouter } from "../../../../../shared/lib/FastifyRouter.js";
import { healthCheckRoute } from "./healthCheck.route.js";

export const PublicRouter = createFastifyRouter("/", {
  [healthCheckRoute.url]: healthCheckRoute,
});
