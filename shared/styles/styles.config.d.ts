/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';

interface ITheme {
  lineHeight: number;
  colors: {
    primary: string;
    secondary: string;
  };
  outline: {
    focus: string;
  };
  iconSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
  textSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  titleSize: {
    sm: string;
    md: string;
    lg: string;
  };
  grayscale: {
    0: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    100: string;
    110: string;
    120: string;
    130: string;
    140: string;
    150: string;
  };
  gap: {
    0: string;
    1: string;
    2: string;
    4: string;
    8: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
  };
  boxShadow: {
    elevation: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
      12: string;
    };
  };
  elevationLevel: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    max: number;
  };
  borderRadius: {
    none: string;
    button: string;
    input: string;
    card: string;
    sm: string;
    md: string;
    lg: string;
    rounded: string;
  };
}

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}
