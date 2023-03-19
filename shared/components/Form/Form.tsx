import { Control } from "@radix-ui/react-form";
import { useMemo, useState } from "react";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  FieldHeader,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
} from "./Form.styles";
import {
  FormData,
  FormElement,
  FormElements,
  FormProps,
  RawFormData,
} from "./Form.types";

const getFormatError = (errorMap?: Record<string, string>) => {
  const getError = (error: string) => {
    if (errorMap && error in errorMap) {
      return errorMap[error];
    }

    return error;
  };

  return (error: string | string[] | undefined | null): string | null => {
    if (!error) return null;

    if (Array.isArray(error)) {
      return error.map(getError).join(", ");
    }

    if (typeof error !== "string") {
      return null;
    }

    return getError(error);
  };
};

const getFormatFormRawData =
  <Element extends FormElement>(formElements: FormElements<Element>) =>
  (data: RawFormData<Element>): FormData<Element> => {
    return Object.entries(data).reduce<FormData<Element>>(
      (acc, [key, data]) => {
        if (!(key in formElements)) {
          return acc;
        }

        const formElementDefinition =
          formElements[key as keyof FormElements<Element>];
        const d = data as string;

        // @ts-ignore
        acc[key as Element["name"]] = formElementDefinition.transform
          ? formElementDefinition.transform(d)
          : d;

        return acc;
      },
      {} as FormData<Element>
    );
  };

const getDefaultValues = <
  Element extends FormElement,
  Elements extends FormElements<Element> = FormElements<Element>
>(
  formElements: Elements
): DefaultValues<RawFormData<Element>> => {
  return Object.entries(formElements).reduce<
    DefaultValues<RawFormData<Element>>
  >((acc, [key, element]) => {
    // @ts-ignore
    acc[key] = element.defaultValue;

    return acc;
  }, {} as DefaultValues<RawFormData<Element>>);
};

export const Form = <Elements extends FormElement>({
  elements,
  onSubmit,
  customValidation,
  errorMap,
  submitButtonText = "Submit",
}: FormProps<Elements>) => {
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<keyof Elements | null>(null);
  const formatError = getFormatError(errorMap);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RawFormData<Elements>>({
    defaultValues: getDefaultValues(elements),
    shouldFocusError: true,
    reValidateMode: "onChange",
    resolver: customValidation,
    mode: "onBlur",
    // delayError: 1000,
  });
  const formatData = useMemo(
    () => getFormatFormRawData(elements),
    [Object.keys(elements).join("")]
  );

  const handleMainSubmit: SubmitHandler<RawFormData<Elements>> = async (
    data
  ) => {
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit(formatData(data));
    } finally {
      setLoading(false);
    }
  };

  const handleInvalid = (...params: any[]) => console.log("invalid", params);

  return (
    <FormRoot onSubmit={handleSubmit(handleMainSubmit, handleInvalid)}>
      {(Object.values(elements) as FormElement[]).map((element) => (
        <FormField name={element.name} key={element.name}>
          <FieldHeader>
            <FormLabel>{element.label}</FormLabel>
            {!loading && element.name in errors && (
              <FormMessage>
                {formatError(
                  errors[element.name as keyof RawFormData<Elements>]
                    ?.types as string[]
                )}
              </FormMessage>
            )}
          </FieldHeader>
          <Control asChild>
            {element.type === "textarea" ? (
              <textarea
                /* @ts-ignore */
                {...register(element.name, {
                  required: element.required,
                  disabled: loading,
                  onBlur: () => {
                    if (focusedInput === element.name) {
                      setFocusedInput(null);
                    }
                  },
                })}
                placeholder={element.placeholder}
                onFocus={() => {
                  setFocusedInput(element.name as keyof Elements);
                }}
              />
            ) : (
              <Input
                /* @ts-ignore */
                {...register(element.name, {
                  required: element.required,
                  disabled: loading,
                  onBlur: () => {
                    if (focusedInput === element.name) {
                      setFocusedInput(null);
                    }
                  },
                })}
                type={element.type}
                placeholder={element.placeholder}
                onFocus={() => {
                  setFocusedInput(element.name as keyof Elements);
                }}
              />
            )}
          </Control>
        </FormField>
      ))}
      <Button
        shouldReplaceTextWithSpinner
        textAlignment="center"
        color="colorless"
        size="medium"
        disabled={loading || Object.keys(errors).length > 0}
        type="submit"
        loading={loading}
      >
        {submitButtonText}
      </Button>
    </FormRoot>
  );
};
