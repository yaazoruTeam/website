import { Meta, StoryFn } from "@storybook/react";
import { CustomTextField } from "./Input";

export default {
  title: "Stories/CustomTextField",
  component: CustomTextField,
  argTypes: {
    disabled: { control: "boolean" },
  },
} as Meta<typeof CustomTextField>;

// Template בסיסי
const Template: StoryFn<typeof CustomTextField> = (args) => <CustomTextField {...args} />;

// שדה טקסט "שם משתמש"
export const UsernameField = Template.bind({});
UsernameField.args = {
  label: "שם משתמש",
  sx: {
    "& .MuiInputLabel-root": {
      textAlign: "right",
    },
  },
};

// שדה טקסט "סיסמה"
export const PasswordField = Template.bind({});
PasswordField.args = {
  label: "סיסמה",
  type: "password",
};

// שדה טקסט עם טקסט עזר
export const EmailField = Template.bind({});
EmailField.args = {
  label: "אימייל",
};

export const FirstNameField = Template.bind({});
FirstNameField.args = {
  label: "שם פרטי",
  sx: {
    direction: "rtl",
  }
};

export const LastNameField = Template.bind({});
LastNameField.args = {
  label: "שם פרטי",
  sx: {
    direction: "rtl",
  }
};
