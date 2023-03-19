/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-default-export */
import { Meta, Story } from "@storybook/react";
import { Button, ButtonProps } from ".";
import { Icon, IconSize } from "../Icon";

export const ColorlessButton: Story<ButtonProps> = (args) => (
  <>
    <Button {...args} size="small">
      I&apos;m a small button
    </Button>
    <Button {...args} color="colorless">
      I&apos;m a colorless button
    </Button>
    <Button {...args} color="transparent">
      I&apos;m a transparent button
    </Button>
    <Button {...args} size="large">
      I&apos;m a large button
    </Button>
  </>
);

export const LoadingButton: Story<ButtonProps> = (args) => (
  <>
    <Button {...args} loading size="small">
      I&apos;m a small disabled loading button
    </Button>
    <Button {...args} loading>
      I&apos;m a loading button
    </Button>
    <Button {...args} loading color="transparent">
      I&apos;m a disabled loading button
    </Button>
    <Button {...args} loading size="large">
      I&apos;m a large disabled loading button
    </Button>
  </>
);

export const ButtonWithIconPrepended: Story<ButtonProps> = (args) => (
  <>
    <Button
      {...args}
      prependIcon={<Icon name="home" size={IconSize.SMALL} />}
      size="small"
    >
      I&apos;m a small disabled button
    </Button>
    <Button {...args} prependIcon={<Icon name="home" />}>
      I&apos;m a button
    </Button>
    <Button {...args} prependIcon={<Icon name="home" />} color="transparent">
      I&apos;m a disabled button
    </Button>
    <Button
      {...args}
      prependIcon={<Icon name="home" size={IconSize.LARGE} />}
      size="large"
    >
      I&apos;m a large disabled loading button
    </Button>
  </>
);

const ButtonMeta: Meta = {
  title: "Components/Button",
  component: ColorlessButton,
  argTypes: {
    size: {
      options: ["small", "medium", "large", "fit"],
      control: { type: "radio" },
    },
    loading: {
      options: [true, false],
      control: { type: "radio" },
    },
  },
};

export default ButtonMeta;
