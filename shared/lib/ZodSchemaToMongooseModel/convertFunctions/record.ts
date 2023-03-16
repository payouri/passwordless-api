import { Schema } from "mongoose";
import { ConvertFunction, DefaultOptions } from "./types";

const MapOf = {
  string: String,
  number: Number,
  boolean: Boolean,
  date: Date,
  object: Object,
  array: Array,
  any: Schema.Types.Mixed,
} as const;

const isMapOf = (type: unknown): type is keyof typeof MapOf => {
  return typeof type === "string" && type in MapOf;
};

export const convertZodRecordToMongooseType: ConvertFunction<
  typeof Map,
  string,
  DefaultOptions & {
    valueType: string[];
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    of:
      options.valueType.length === 1 && isMapOf(options.valueType[0])
        ? MapOf[options.valueType[0]]
        : Schema.Types.Mixed,
    type: Map,
  },
});
