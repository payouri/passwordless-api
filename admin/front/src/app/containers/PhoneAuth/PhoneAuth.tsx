import { useTranslation } from "../../../customHooks/useTranslation";
import { phoneAuthFormDataSchema } from "../../../validators";
import { Form } from "../../components/Form/Form";

export const PhoneAuth = ({
  onLogin,
}: {
  onLogin: (phone: string) => Promise<void> | void;
}) => {
  const { t } = useTranslation();

  return (
    <Form<{
      name: "phoneNumber";
      label: string;
      required: true;
      type: "phone";
      placeholder: string;
    }>
      elements={{
        phoneNumber: {
          label: t("forms.phone.label"),
          name: "phoneNumber",
          required: true,
          type: "phone",
          placeholder: t("forms.phone.placeholder"),
        },
      }}
      errorMap={{
        phone_is_required: t("forms.phone.errors.required"),
        phone_is_not_a_string: t("forms.phone.errors.invalid"),
        phone_is_empty: t("forms.phone.errors.required"),
        invalid_phone: t("forms.phone.errors.invalid"),
      }}
      onSubmit={async ({ phoneNumber }) => {
        await onLogin(phoneNumber);
      }}
      submitButtonText={t("login")}
      customValidation={(values) => {
        const validationResult = phoneAuthFormDataSchema.safeParse(values);

        if (!validationResult.success) {
          return {
            errors: {
              phoneNumber: {
                types:
                  validationResult.error.formErrors.fieldErrors.phoneNumber ||
                  {},
                type:
                  validationResult.error.formErrors.fieldErrors
                    .phoneNumber?.[0] || "",
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
