import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "./Button";
import { useNavigate } from "react-router-dom";
export default {
  title: "Stories/CustomButton",
  component: CustomButton,
  argTypes: {
    color: {
      control: "select",
      options: ["addCustomer"],
    },
    disabled: { control: "boolean" },
  },
} as Meta<typeof CustomButton>;

const Template: StoryFn<typeof CustomButton> = (args) => <CustomButton {...args} />;

export const AddCustomer = Template.bind({});
AddCustomer.args = {
  label: "הוספת לקוח",
  onClick: () => {
    const navigate = useNavigate();
    navigate('/customers');
    // <useNavigate to="/customers" />
  }
};

