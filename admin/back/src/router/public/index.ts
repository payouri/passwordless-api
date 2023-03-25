import { createFastifyRouter } from "../../../../../shared/lib/FastifyRouter.js";
import { authenticateUser } from "./authenticateUser.js";
import { getAuthData } from "./getAuthData.js";
import { healthCheckRoute } from "./healthCheck.route.js";

export const PublicRouter = createFastifyRouter({
  mountPoint: "/",
  routesMap: {
    [healthCheckRoute.url]: healthCheckRoute,
    [getAuthData.url]: getAuthData,
  },
  middlewares: [
    async () => {
      console.trace("middleware");
    },
  ],
});
