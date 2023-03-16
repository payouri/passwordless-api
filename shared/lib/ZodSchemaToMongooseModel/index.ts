import { Schema } from "mongoose";
import { ZodObject, ZodRawShape } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { convertZodTypeToMongooseType } from "./convertFunctions/index.js";
import { writeFile } from "fs/promises";

export const convertZodSchemaToMongooseModel = <
  T extends ZodObject<ZodRawShape>
>(
  zodSchema: T
): Schema => {
  const jsonSchema = zodToJsonSchema(zodSchema) as unknown as {
    properties: Record<string, { type: string }>;
    required: string[];
  };

  for (const key in jsonSchema.properties) {
    if (key === "_id") {
      delete jsonSchema.properties[key];
    }
  }

  const schemaData = convertZodTypeToMongooseType({
    properties: jsonSchema.properties,
    requiredFields: jsonSchema.required,
  });

  return new Schema(schemaData);
};
