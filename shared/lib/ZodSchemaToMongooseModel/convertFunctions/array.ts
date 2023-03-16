import { Schema } from "mongoose";
import { validateLength } from "../helpers/validateLength.js";
import { ConvertFunction, DefaultOptions, Type } from "./types.js";

export const convertArrayTypeToMongooseType: ConvertFunction<
  Type[],
  string,
  DefaultOptions & {
    items?: Type;
    minItems?: number;
    maxItems?: number;
  }
> = (fieldName, { required, items, ...options }) => ({
  [fieldName]: {
    required,
    type: items ? [items] : [Schema.Types.Mixed],
    ...(options.maxItems || options.minItems || options.validate
      ? {
          validate: options.validate ?? [
            (v: unknown[]) =>
              validateLength(v, {
                max: options.maxItems,
                min: options.minItems,
              }),
            `{PATH} exceeds the limit of ${options.maxItems} items`,
          ],
        }
      : {}),
  },
});
