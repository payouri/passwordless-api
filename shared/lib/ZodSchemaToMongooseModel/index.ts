import { ZodObject, ZodRawShape } from "zod";
import { Schema, SchemaType, Validator } from "mongoose";
import { zodToJsonSchema } from "zod-to-json-schema";
import { validateLength } from "./helpers/validateLength.js";

type ConvertFunction<
  FieldName extends string = string,
  Options extends { required: boolean } = { required: boolean }
> = (
  fieldName: FieldName,
  options: Options
) => {
  [Key in FieldName]: {
    type:
      | typeof String
      | typeof Number
      | typeof Boolean
      | typeof Date
      | typeof Buffer
      | typeof Schema.Types.ObjectId
      | typeof Schema.Types.Mixed
      | unknown[]
      | typeof Object
      | {
          [x: string]: {
            type:
              | typeof String
              | typeof Number
              | typeof Boolean
              | typeof Date
              | typeof Buffer
              | typeof Schema.Types.ObjectId
              | typeof Schema.Types.Mixed
              | unknown[]
              | typeof Object;
          };
        };
  } & Options & {
      validate?: [Required<Validator>["validator"], string] | Validator[];
    };
};

const convertZodStringToMongooseType: ConvertFunction<
  string,
  { required: boolean; minLength?: number; maxLength?: number }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: String,
  },
});

const convertZodNumberToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
    min?: number;
    max?: number;
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Number,
  },
});

const convertZodBooleanToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Boolean,
  },
});

const convertUnknownTypeToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Schema.Types.Mixed,
  },
});

const convertArrayTypeToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
    items?: unknown;
    minItems?: number;
    maxItems?: number;
  }
> = (fieldName, { required, items, ...options }) => ({
  [fieldName]: {
    required,
    type: items ? [items] : [Schema.Types.Mixed],
    ...(options.maxItems || options.minItems
      ? {
          validate: [
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

const convertObjectTypeToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
    properties?: {
      [key: string]: {
        type: string;
      };
    };
    requiredFields?: string[];
  }
> = (fieldName, { required, properties, requiredFields }) => ({
  [fieldName]: {
    required,
    type: properties ? {} : Schema.Types.Mixed,
  },
});

const convertZodDateToMongooseType: ConvertFunction<
  string,
  {
    required: boolean;
  }
> = (fieldName, options) => ({
  [fieldName]: {
    ...options,
    type: Date,
  },
});

const convertMap: Record<
  "string" | "number" | "boolean" | "array" | "date" | "object" | "any",
  ConvertFunction
> = {
  string: convertZodStringToMongooseType,
  number: convertZodNumberToMongooseType,
  boolean: convertZodBooleanToMongooseType,
  any: convertUnknownTypeToMongooseType,
  array: convertArrayTypeToMongooseType,
  object: convertObjectTypeToMongooseType,
  date: convertZodDateToMongooseType,
};

const convertZodTypeToMongooseType = <
  T extends {
    properties: Record<string, Record<string, any> & { type: string }>;
    requiredFields: string[];
  }
>(
  zodType: T
) => {
  const { properties, requiredFields } = zodType;

  return Object.entries(properties).reduce<{
    [key: string]: {
      type:
        | typeof String
        | typeof Number
        | typeof Boolean
        | typeof Date
        | typeof Buffer
        | typeof Schema.Types.ObjectId
        | typeof Schema.Types.Mixed
        | unknown[]
        | typeof Object
        | SchemaType
        | {
            [x: string]: {
              type:
                | typeof String
                | typeof Number
                | typeof Boolean
                | typeof Date
                | typeof Buffer
                | typeof Schema.Types.ObjectId
                | typeof Schema.Types.Mixed
                | unknown[]
                | typeof Object
                | SchemaType;
            };
          };
    };
  }>((acc, [fieldName, { type, ...options }]) => {
    if (fieldName === "_id") return acc;

    const isRequired = requiredFields.includes(fieldName);
    if (!(type in convertMap)) {
      // @ts-ignore
      acc[fieldName] = convertUnknownTypeToMongooseType(fieldName, {
        ...options,
        required: isRequired,
      });
      return acc;
    }

    // @ts-ignore
    const convertFunction = convertMap[type];

    if (type === "string" && options.format === "date-time") {
      // @ts-ignore
      acc[fieldName] = convertZodDateToMongooseType(fieldName, {
        ...options,
        required: isRequired,
      });
    } else
      acc[fieldName] = convertFunction(fieldName, {
        ...options,
        ...(type === "array" && options.items
          ? {
              items:
                options.items.type in convertMap
                  ? // @ts-ignore
                    convertMap[options.items.type]("items", options.items)[
                      "items"
                    ]
                  : {
                      type: Schema.Types.Mixed,
                    },
            }
          : {}),
        required: isRequired,
      });

    return acc;
  }, {});
};

export const convertZodSchemaToMongooseModel = <
  T extends ZodObject<ZodRawShape>
>(
  zodSchema: T
): Schema => {
  const jsonSchema = zodToJsonSchema(zodSchema) as unknown as {
    properties: Record<string, { type: string }>;
    required: string[];
  };

  console.log(
    convertZodTypeToMongooseType({
      properties: jsonSchema.properties,
      requiredFields: jsonSchema.required,
    })
  );

  return new Schema(
    convertZodTypeToMongooseType({
      properties: jsonSchema.properties,
      requiredFields: jsonSchema.required,
    })
  );
};
