import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import LoginForm from "./Form";

export default {
  title: "Stories/LoginForm",
  component: LoginForm,
} as Meta<typeof LoginForm>;

const Template: StoryFn<typeof LoginForm> = (args) => <LoginForm onSubmit={()=>{}}/>;

export const Form = Template.bind({});
Form.args = {};
