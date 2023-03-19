import { initModels } from "../entities/index.js";
import init from "./init.js";
import { adminMongo, apiMongo } from "./mongo.js";

export const initApp = async () => {
  const [adminMongoConnection, apiMongoConnection] = await Promise.all([
    adminMongo.connectToMongo(),
    apiMongo.connectToMongo(),
  ]);

  await initModels({
    adminMongoConnection,
    apiMongoConnection,
  });

  await init({
    adminMongoConnection,
    apiMongoConnection,
  });
};
