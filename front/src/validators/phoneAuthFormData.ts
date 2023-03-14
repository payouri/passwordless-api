import { z } from "zod";

const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

const phoneNumberSchema = z
  .string({
    required_error: "phone_number_is_required",
    invalid_type_error: "phone_number_is_not_a_string",
  })
  .nonempty({
    message: "phone_number_is_empty",
  })
  .refine((value) => {
    return phoneNumberRegex.test(value);
  }, "invalid_phone_number");

export const phoneAuthFormDataSchema = z.object({
  phoneNumber: phoneNumberSchema,
});
