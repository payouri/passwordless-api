import { MongoError } from "mongodb";

const isError = (error: unknown): error is Error => error instanceof Error;

const getErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    return JSON.stringify(error);
  }

  return "Could not get error message";
};

const isDuplicateKeyError = (error: unknown): boolean => {
  if (isError(error) && error instanceof MongoError) {
    return error.code === 11000;
  }

  return false;
};

export { isError, isDuplicateKeyError, getErrorMessage };
