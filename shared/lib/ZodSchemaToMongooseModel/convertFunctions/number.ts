import { Validator } from "mongoose";
import type { ConvertFunction } from "./types";

export const convertZodNumberToMongooseType: ConvertFunction<
  typeof Number,
  string,
  {
    required: boolean;
    validate?: [Required<Validator>["validator"], string] | Validator[];
    min?: number;
    max?: number;
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Number,
  },
});
