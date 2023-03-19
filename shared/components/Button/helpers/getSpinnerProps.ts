import { SpinnerProps } from "../../Spinner/Spinner";
import { ButtonProps } from "../types";

const LineHeight = 1.5;

export const getSpinnerProps = (
  props: Pick<ButtonProps, "size">
): SpinnerProps => {
  if (props.size === "small") {
    return {
      ringSize: "0.125rem",
      size: {
        height: `${LineHeight * 0.875}rem`,
        width: `${LineHeight * 0.875}rem`,
      },
    };
  }
  if (props.size === "large") {
    return {
      ringSize: "0.25rem",
      size: {
        height: `${LineHeight * 1.25}rem`,
        width: `${LineHeight * 1.25}rem`,
      },
    };
  }
  return {
    ringSize: "0.25rem",
    size: {
      height: `${LineHeight * 1}rem`,
      width: `${LineHeight * 1}rem`,
    },
  };
};
