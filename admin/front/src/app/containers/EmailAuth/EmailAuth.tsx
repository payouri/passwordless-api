import { useTranslation } from "../../../customHooks/useTranslation";
import { emailAuthFormDataSchema } from "../../../validators";
import { Form } from "../../components/Form/Form";

export const EmailAuth = ({
  onLogin,
}: {
  onLogin: (email: string) => Promise<void> | void;
}) => {
  const { t } = useTranslation();

  return (
    <Form<{
      name: "email";
      label: string;
      required: true;
      type: "email";
      placeholder: string;
    }>
      elements={{
        email: {
          label: t("forms.email.label"),
          name: "email",
          required: true,
          type: "email",
          placeholder: t("forms.email.placeholder"),
        },
      }}
      errorMap={{
        email_is_required: t("forms.email.errors.required"),
        email_is_not_a_string: t("forms.email.errors.invalid"),
        email_is_empty: t("forms.email.errors.required"),
        invalid_email: t("forms.email.errors.invalid"),
      }}
      onSubmit={async ({ email }) => {
        await onLogin(email);
      }}
      submitButtonText={t("login")}
      customValidation={(values) => {
        const validationResult = emailAuthFormDataSchema.safeParse(values);

        if (!validationResult.success) {
          return {
            errors: {
              email: {
                types:
                  validationResult.error.formErrors.fieldErrors.email || {},
                type:
                  validationResult.error.formErrors.fieldErrors.email?.[0] ||
                  "",
              },
            },
            values: {},
          };
        }

        return {
          errors: {},
          values: validationResult.data,
        };
      }}
    />
  );
};
