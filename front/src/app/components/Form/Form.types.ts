import { Resolver } from "react-hook-form";

export type FormElement<ResultType = string> = {
  name: string;
  label: string;
  type: HTMLInputElement["type"] | "textarea";
  placeholder?: string;
  required?: boolean;
  transform?: (value: string) => ResultType;
  defaultValue?: string;
};

export type FormElements<Element extends FormElement = FormElement> = {
  [key in Element["name"]]: Element & {
    name: key;
  };
};

export type FormData<
  Element extends FormElement,
  Elements extends FormElements<Element> = FormElements<Element>
> = {
  [key in keyof Elements]: Elements[key]["transform"] extends (
    value: string
  ) => infer ResultType
    ? ResultType
    : string;
};

export type RawFormData<Element extends FormElement = FormElement> = {
  [key in Element["name"]]: string;
};

export type OnSubmit<Element extends FormElement = FormElement> = (
  data: FormData<Element>
) => Promise<void> | void;

export type FormProps<Element extends FormElement = FormElement> = {
  elements: FormElements<Element>;
  onSubmit: OnSubmit<Element>;
  customValidation?: Resolver<RawFormData<Element>>;
  errorMap?: Record<string, string>;
  submitButtonText?: string;
};
