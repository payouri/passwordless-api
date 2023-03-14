import { useTheme } from 'styled-components';
import { IconMap } from './constants';
import { getIconSize } from './helpers/getIconSize';
import { IconWrapper } from './styles';
import { IconProps, IconSize } from './types';

export { IconSize } from './types';
export type { IconProps };

export const Icon = ({
  name,
  size = IconSize.MEDIUM,
  color,
  ...props
}: IconProps) => {
  const iconSize = getIconSize(useTheme(), size);

  return (
    <IconWrapper iconSize={iconSize}>
      {IconMap[name]({
        ...props,
        size: iconSize,
        color: color || 'currentColor',
      })}
    </IconWrapper>
  );
};
