/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-default-export */
import { Meta, Story } from '@storybook/react';
import { Input } from '.';
import { InputProps } from './types';

export const InputStory: Story<InputProps> = (args) => <Input {...args} />;
InputStory.args = {
  children: <input />,
};

const IconMeta: Meta<InputProps> = {
  title: 'Components/Input',
  component: InputStory,
};

export default IconMeta;
