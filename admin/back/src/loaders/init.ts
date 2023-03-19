import { Connection } from "mongoose";
import { buildInitAdminControllers } from "../controllers/admin/index.js";
import { initModels } from "../entities/index.js";

export default async function init({
  adminMongoConnection,
  apiMongoConnection,
}: {
  adminMongoConnection: Connection;
  apiMongoConnection: Connection;
}) {
  const { adminDomainModel, adminUserAccountModel } = await initModels({
    adminMongoConnection: adminMongoConnection,
    apiMongoConnection: apiMongoConnection,
  });

  const { initAdmin, verifyAdmin } = buildInitAdminControllers({
    adminDomainModel,
    adminUserAccountModel,
  });

  const { status } = await verifyAdmin();

  if (!status) {
    await initAdmin();
  }
}
