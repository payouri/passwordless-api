import { css } from 'styled-components';
import { ButtonSize } from '../types';

const ButtonSizeStyleMap = {
  small: css`
    font-size: ${({ theme: { textSize } }) => textSize.sm};
    padding: ${({ theme: { gap } }) => `${gap[4]} ${gap[12]}`};
  `,
  medium: css`
    font-size: ${({ theme: { textSize } }) => textSize.md};
    padding: ${({ theme: { gap } }) => `${gap[8]} ${gap[12]}`};
  `,
  large: css`
    font-size: ${({ theme: { titleSize } }) => titleSize.sm};
    padding: ${({ theme: { gap } }) => `${gap[16]} ${gap[20]}`};
  `,
} as const;

export const getButtonStyleFromSize = ({ size }: { size: ButtonSize }) => {
  return Reflect.has(ButtonSizeStyleMap, size)
    ? ButtonSizeStyleMap[size]
    : ButtonSizeStyleMap.medium;
};
