import type { ConvertFunction } from "./types";

export const convertZodDateToMongooseType: ConvertFunction<typeof Date> = (
  fieldName,
  options
) => ({
  [fieldName]: {
    ...options,
    type: Date,
  },
});
