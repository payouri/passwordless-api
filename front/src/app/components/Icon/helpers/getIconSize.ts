import { DefaultTheme } from 'styled-components';
import { IconProps, IconSize } from '../types';

export const getIconSize = (
  theme: DefaultTheme,
  size: IconProps['size']
): string => {
  switch (size) {
    case IconSize.SMALL:
      return theme.iconSize.sm;
    case IconSize.MEDIUM:
      return theme.iconSize.md;
    case IconSize.LARGE:
      return theme.iconSize.xl;
    default: {
      if (typeof size === 'string') {
        return size;
      }
      if (typeof size === 'number') {
        return `${size}px`;
      }
      return theme.iconSize.md;
    }
  }
};
