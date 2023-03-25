import { z } from "zod";
import { createFastifyRouter } from "../../../../../shared/lib/FastifyRouter.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { authenticateUser } from "./authenticateUser.js";

const authenticateUserTokenDataSchema = z.object({
  domainId: z.string(),
});

export const PrivateRouter = createFastifyRouter({
  mountPoint: "/",
  routesMap: {
    [authenticateUser.url]: authenticateUser,
  },
  middlewares: [verifyToken(authenticateUserTokenDataSchema)],
});
