import { Connection, ConnectOptions, createConnection } from "mongoose";
import { Logger } from "winston";
import { getLogger } from "../Logger/index.js";

type CreateMongoManagerParams = {
  mongoDbURI: string;
  autoConnect?: boolean;
  logger?: Logger;
  connectOptions?: ConnectOptions;
};

type CreateMongoManagerReturnType = {
  readonly isConnected: boolean;
  readonly connection: Connection;
  connect: () => Promise<Connection>;
  disconnect: () => Promise<Connection>;
};

export const createMongoManager = ({
  mongoDbURI,
  connectOptions = {},
  autoConnect,
  logger = getLogger(),
}: CreateMongoManagerParams): CreateMongoManagerReturnType => {
  const connection = createConnection(mongoDbURI, connectOptions);

  const connect = async () => {
    if (connection.readyState === 1) {
      logger.warn(`Already connected to MongoDB: ${mongoDbURI}`);
      return connection;
    }

    logger.info(`Connecting to MongoDB: ${mongoDbURI}`);
    try {
      await connection.asPromise();
      logger.info(`Connected to MongoDB: ${mongoDbURI}`);
    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${mongoDbURI}`);
      logger.error(error);
    }

    return connection;
  };

  const disconnect = async () => {
    if (connection.readyState === 0) {
      logger.warn(`Already disconnected from MongoDB: ${mongoDbURI}`);
      return connection;
    }

    logger.info(`Disconnecting from MongoDB: ${mongoDbURI}`);
    try {
      await connection.close();
      logger.info(`Disconnected from MongoDB: ${mongoDbURI}`);
    } catch (error) {
      logger.error(`Error disconnecting from MongoDB: ${mongoDbURI}`);
      logger.error(error);
    }

    return connection;
  };

  if (autoConnect) {
    connect();
  }

  return {
    get isConnected() {
      return connection.readyState === 1;
    },
    get connection() {
      return connection;
    },
    connect,
    disconnect,
  };
};
