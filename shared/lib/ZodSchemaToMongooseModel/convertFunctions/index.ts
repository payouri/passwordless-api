import { Schema } from "mongoose";
import { isObject } from "../../../guards/isObject.js";
import { isStringArray } from "../../../guards/isStringArray.js";
import { concatAnyOfFields } from "../helpers/concatAnyOfFields.js";
import { hasAnyOfArrayField } from "../helpers/hasAnyOfArrayField.js";
import { isDefaultOptionsObject } from "../helpers/isDefaultOptionsObject.js";
import { convertUnknownTypeToMongooseType } from "./any.js";
import { convertArrayTypeToMongooseType } from "./array.js";
import { convertZodBooleanToMongooseType } from "./boolean.js";
import { convertZodDateToMongooseType } from "./date.js";
import { convertZodNumberToMongooseType } from "./number.js";
import { convertZodRecordToMongooseType } from "./record.js";
import { convertZodStringToMongooseType } from "./string.js";
import { ConvertFunction } from "./types.js";

export const convertMap: Record<
  "string" | "number" | "boolean" | "array" | "date" | "object" | "any",
  ConvertFunction
> = {
  string: convertZodStringToMongooseType,
  number: convertZodNumberToMongooseType,
  boolean: convertZodBooleanToMongooseType,
  any: convertUnknownTypeToMongooseType,
  array: convertArrayTypeToMongooseType,
  object: (params, options) => {
    if (hasAnyOfArrayField(options)) {
      return convertZodRecordToMongooseType(params, {
        ...options,
        valueType: concatAnyOfFields(options),
      });
    }
    const properties = (
      "properties" in options && isObject(options.properties)
        ? options.properties
        : {}
    ) as Record<string, Record<string, any> & { type: string }>;

    const requiredFields = isStringArray(options.required)
      ? options.required
      : [];

    return convertZodTypeToMongooseType({
      properties,
      requiredFields,
      rootKey: params,
      isRequired: options.required,
    });
  },
  date: convertZodDateToMongooseType,
} as const;

const isConvertMap = (type: string): type is keyof typeof convertMap => {
  return type in convertMap;
};

export function convertZodTypeToMongooseType<
  T extends {
    properties: Record<string, Record<string, any> & { type: string }>;
    requiredFields: string[];
    rootKey?: string;
    isRequired?: boolean;
  }
>(zodType: T): ReturnType<ConvertFunction> {
  const { properties, requiredFields, isRequired, rootKey } = zodType;

  const result = Object.entries(properties).reduce<ReturnType<ConvertFunction>>(
    (acc, [fieldName, { type, ...options }]) => {
      const isRequired = requiredFields.includes(fieldName);
      if (!isConvertMap(type)) {
        return {
          ...acc,
          ...convertUnknownTypeToMongooseType(fieldName, {
            ...options,
            required: isRequired,
          }),
        };
      }

      const convertFunction = convertMap[type];

      if (type === "string" && options.format === "date-time") {
        return {
          ...acc,
          ...convertZodDateToMongooseType(fieldName, {
            ...options,
            required: isRequired,
          }),
        };
      } else {
        return {
          ...acc,
          ...convertFunction(fieldName, {
            ...options,
            ...(type === "array"
              ? {
                  items:
                    isObject(options.items) &&
                    typeof options.items.type === "string" &&
                    isConvertMap(options.items.type)
                      ? convertMap[options.items.type](
                          "items",
                          isDefaultOptionsObject(options.items)
                            ? options.items
                            : {
                                required: false,
                              }
                        )["items"]
                      : {
                          type: Schema.Types.Mixed,
                        },
                }
              : {}),
            required: options.required || isRequired,
          }),
        };
      }
    },
    {} as ReturnType<ConvertFunction>
  );

  if (zodType.rootKey) {
    // @ts-ignore
    return {
      [zodType.rootKey]: {
        type: new Schema(result, {
          _id: result._id ? true : false,
        }),
        required:
          (Array.isArray(isRequired) && isRequired[0]) ||
          (typeof isRequired === "boolean" && isRequired)
            ? true
            : false,
      },
    };
  }
  return result;
}
