import { ConvertFunction } from "./types";

export const convertZodStringToMongooseType: ConvertFunction<
  typeof String,
  string,
  { required: boolean; minLength?: number; maxLength?: number }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: String,
  },
});
