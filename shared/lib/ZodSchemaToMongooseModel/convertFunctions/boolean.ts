import type { ConvertFunction } from "./types";

export const convertZodBooleanToMongooseType: ConvertFunction<typeof Boolean> =
  (fieldName, options) => ({
    [fieldName]: {
      ...options,
      type: Boolean,
    },
  });
