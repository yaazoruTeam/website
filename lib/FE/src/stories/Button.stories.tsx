import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "../components/designComponent/Button";
import { ThemeProvider } from '@mui/material/styles';
import { colors, theme } from "../styles/theme";
import { EyeIcon } from '@heroicons/react/24/outline'

export default {
  title: "Stories/CustomButton",
  component: CustomButton,
  argTypes: {
    disabled: { control: "boolean" },
  },
} as Meta<typeof CustomButton>;

const Template: StoryFn<typeof CustomButton> = (args) => (
  <ThemeProvider theme={theme}> {/* עטוף את הקומפוננטה ב-ThemeProvider */}
    <CustomButton
    {...args} />
  </ThemeProvider>);

export const ExampleRegularButton = Template.bind({});
ExampleRegularButton.args = {
  label: "הזמנה חדשה",
  size: 'large',
  buttonType: 'first',
  state: 'default',
  icon: <EyeIcon className="h-5 w-5" />
};

export const ExampleWhiteButton = Template.bind({});
ExampleWhiteButton.args = {
  label: "התחברות",
  size:'small',
  state:'hover',
  buttonType:'second'
};

export const ExampleWithImg = Template.bind({});
ExampleWithImg.args = {
  label: "מחיקת לקוח",
  sx: {
    background: "white",
    color: colors.c11,
    border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
    "&:hover": {
      background: "#f9fafc",
    },
  },
  // img: trashIcon,
};

export const ExampleGrayButton = Template.bind({});
ExampleGrayButton.args = {
  label: "אישור",
  sx: {
    background: colors.c10,
    color: colors.c6,
  },
};