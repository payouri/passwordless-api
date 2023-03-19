import { Connection } from "mongoose";
import { buildInitAdminControllers } from "../controllers/admin/index.js";
import { initModels } from "../entities/index.js";
import { initServices } from "../services/index.js";
import { getRuntimeStore } from "./runtimeStore.js";

export default async function init({
  adminMongoConnection,
  apiMongoConnection,
}: {
  adminMongoConnection: Connection;
  apiMongoConnection: Connection;
}) {
  const {
    adminAuthSessionModel,
    adminDomainModel,
    adminUserAccountModel,
    userAccountModel,
  } = await initModels({
    adminMongoConnection: adminMongoConnection,
    apiMongoConnection: apiMongoConnection,
  });

  initServices({
    adminAuthSessionModel,
    adminDomainModel,
    adminUserAccountModel,
    userAccountModel,
  });

  const { initAdmin, verifyAdmin } = buildInitAdminControllers();

  const { status } = await verifyAdmin();

  if (!status) {
    await initAdmin();
  }

  const runtimeStore = getRuntimeStore();

  await runtimeStore.init();
}
