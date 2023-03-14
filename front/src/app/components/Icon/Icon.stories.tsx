/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-default-export */
import { Meta, Story } from '@storybook/react';
import { IconMap } from './constants';
import { Icon, IconProps, IconSize } from '.';

export const IconWithSize: Story<IconProps> = ({ name, ...args }) => (
  <>
    <Icon {...args} name={name || 'cart'} size={IconSize.SMALL} />
    <Icon {...args} name={name || 'cart'} />
    <Icon {...args} name={name || 'cart'} size={IconSize.LARGE} />
  </>
);

export const AllIcons: Story<IconProps> = ({ name, ...args }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gridGap: '1rem',
    }}
  >
    {Object.keys(IconMap).map((iconName) => (
      <Icon {...args} name={iconName as IconProps['name']} />
    ))}
  </div>
);

const IconMeta: Meta = {
  title: 'Components/Icon',
  component: IconWithSize,
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: Object.keys(IconMap),
      },
    },
    size: {
      control: {
        type: 'select',
        options: Object.values(IconSize),
      },
    },
  },
};

export default IconMeta;
