import { Schema } from "mongoose";
import { ConvertFunction } from "./types";

export const convertUnknownTypeToMongooseType: ConvertFunction<
  typeof Schema.Types.Mixed
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Schema.Types.Mixed,
  },
});
