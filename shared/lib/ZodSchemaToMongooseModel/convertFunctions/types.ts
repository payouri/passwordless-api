import { Schema, Validator } from "mongoose";

export type Type =
  | typeof String
  | typeof Number
  | typeof Boolean
  | typeof Date
  | typeof Buffer
  | typeof Schema.Types.ObjectId
  | typeof Schema.Types.Mixed
  | unknown[]
  | typeof Object
  | typeof Map
  | {
      [x: string]: {
        type: Type;
      };
    };

export type DefaultOptions = {
  required: boolean;
  validate?: [Required<Validator>["validator"], string] | Validator[];
};

export type RecordType<
  Keys extends string = string,
  Current extends Type = Type,
  Options extends DefaultOptions = DefaultOptions
> = {
  [Key in Keys]: {
    type: Current;
  } & Options;
};

export type ConvertFunction<
  CurrentType extends Type = Type,
  FieldName extends string = string,
  Options extends DefaultOptions = DefaultOptions
> = (
  fieldName: FieldName,
  options: Options
) => RecordType<FieldName, CurrentType, Options>;
