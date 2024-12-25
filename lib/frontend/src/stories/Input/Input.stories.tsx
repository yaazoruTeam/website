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
const UsernameFieldArgs = UsernameField.args = {
  label: "שם משתמש",
  sx: {
    "& .MuiInputLabel-root": {
      textAlign: "right",
    },
  },
};

// שדה טקסט "סיסמה"
export const PasswordField = Template.bind({});
const PasswordFieldArgs = PasswordField.args = {
  label: "סיסמה",
  type: "password",
};

// שדה טקסט עם טקסט עזר
export const EmailField = Template.bind({});
const EmailFieldArgs = EmailField.args = {
  label: "אימייל",
};

export const FirstNameField = Template.bind({});
const FirstNameFieldArgs = FirstNameField.args = {
  label: "שם פרטי",
  sx: {
    direction: "rtl",
  }
};

export const LastNameField = Template.bind({});
const LastNameFieldArgs = LastNameField.args = {
  label: "שם פרטי",
  sx: {
    direction: "rtl",
  }
};

export {
  UsernameFieldArgs,
  PasswordFieldArgs,
  EmailFieldArgs,
  FirstNameFieldArgs,
  LastNameFieldArgs,
}
