import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "./Button";
import trashIcon from '../../assets/trash-can.svg';

export default {
  title: "Stories/CustomButton",
  component: CustomButton,
  argTypes: {
    disabled: { control: "boolean" },
  },
} as Meta<typeof CustomButton>;

const Template: StoryFn<typeof CustomButton> = (args) => <CustomButton {...args} />;

export const ExampleRegularButton = Template.bind({});
ExampleRegularButton.args = {
  label: "הזמנה חדשה",
  sx: {
    background: "#FF7F07",
    color: "white",
    "&:hover": {
      background: "#0a425f",
    },
  },
};

export const ExampleWhiteButton = Template.bind({});
ExampleWhiteButton.args = {
  label: "התחברות",
  sx: {
    background: "white",
    color: "#032B40",
    border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
    "&:hover": {
      background: "#f9fafc",
    },
  },
};

export const ExampleWithImg = Template.bind({});
ExampleWithImg.args = {
  label: "מחיקת לקוח",
  sx: {
    background: "white",
    color: "#032B40",
    border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
    "&:hover": {
      background: "#f9fafc",
    },
  },
  img: trashIcon,
};
