import { z } from "zod";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const emailSchema = z
  .string({
    required_error: "email_is_required",
    invalid_type_error: "email_is_not_a_string",
  })
  .nonempty({
    message: "email_is_empty",
  })
  .refine((value) => emailRegex.test(value), "invalid_email");

export const emailAuthFormDataSchema = z.object({
  email: emailSchema,
});
