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

export { isError, getErrorMessage };
