import { createMongoManager } from "../../shared/lib/MongoManager/index.js";
import { MONGO_URI } from "./config.js";

const mainMongoManager = createMongoManager({
  mongoDbURI: MONGO_URI,
  autoConnect: false,
});

const connectToMongo = () => {
  return mainMongoManager.connect();
};

const disconnectFromMongo = () => {
  return mainMongoManager.disconnect();
};

const isMongoConnected = () => {
  return mainMongoManager.isConnected;
};

const getConnection = () => {
  return mainMongoManager.connection;
};

export { connectToMongo, disconnectFromMongo, isMongoConnected, getConnection };
