import { createMongoManager } from "../../../../shared/lib/MongoManager/index.js";
import { MONGO_URI, API_MONGO_URI } from "../config.js";

const adminMongoManager = createMongoManager({
  mongoDbURI: MONGO_URI,
  autoConnect: false,
});

const apiMongoManager = createMongoManager({
  mongoDbURI: API_MONGO_URI,
  autoConnect: false,
});

const connectToMongo =
  (manager: ReturnType<typeof createMongoManager>) => () => {
    return manager.connect();
  };

const disconnectFromMongo =
  (manager: ReturnType<typeof createMongoManager>) => () => {
    return manager.disconnect();
  };

const isMongoConnected =
  (manager: ReturnType<typeof createMongoManager>) => () => {
    return manager.isConnected;
  };

const getConnection =
  (manager: ReturnType<typeof createMongoManager>) => () => {
    return manager.connection;
  };

export const adminMongo = {
  connectToMongo: connectToMongo(adminMongoManager),
  disconnectFromMongo: disconnectFromMongo(adminMongoManager),
  isMongoConnected: isMongoConnected(adminMongoManager),
  getConnection: getConnection(adminMongoManager),
};

export const apiMongo = {
  connectToMongo: connectToMongo(apiMongoManager),
  disconnectFromMongo: disconnectFromMongo(apiMongoManager),
  isMongoConnected: isMongoConnected(apiMongoManager),
  getConnection: getConnection(apiMongoManager),
};
