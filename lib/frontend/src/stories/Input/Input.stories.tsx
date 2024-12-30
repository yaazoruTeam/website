import { Meta, StoryFn } from "@storybook/react";
import { CustomTextField, CustomTextFieldProps } from "./Input";
import { useForm } from "react-hook-form";

export default {
  title: "Stories/CustomTextField",
  component: CustomTextField,
} as Meta<typeof CustomTextField>;

const Template: StoryFn<CustomTextFieldProps> = (args) => {
  const { control } = useForm();
  return <CustomTextField {...args} control={control} />;
};

export const DefaultField = Template.bind({});
DefaultField.args = {
  name: "default",
  label: "Default Label",
  helperText: "This is a helper text",
};

export const ErrorField = Template.bind({});
ErrorField.args = {
  name: "error",
  label: "Error Field",
  errorMessage: "This field has an error",
};

export const EmailField = Template.bind({});
EmailField.args = {
  name: "email",
  label: "Email Address",
  helperText: "Please enter your email",
  type: "email",
  rules: {
    required: "אימייל הוא שדה חובה",
    pattern: {
      value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: "כתובת אימייל לא תקינה"
    }
  }
};

export const UserNameField = Template.bind({});
const userNameArgs = UserNameField.args = {
  name: "userName",
  label: "שם משתמש",
  // helperText: "Please enter your email",
  rules: {
    required: "שדה חובה"
  }
};

export const PasswordField = Template.bind({});
const passwordArgs = PasswordField.args = {
  name: "password",
  label: "סיסמה",
  type: "password",
  // helperText: "Please enter your email",
  rules: {
    required: "שדה חובה",
    // minLength: {
    //   value: 6,
    //   message: "הסיסמה חייבת להיות לפחות 6 תווים"
    // }
  }
};

export { userNameArgs, passwordArgs }