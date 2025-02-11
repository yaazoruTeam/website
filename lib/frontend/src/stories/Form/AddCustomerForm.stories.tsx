import { Meta, StoryFn } from "@storybook/react";

import AddCustomerForm from "../../components/customers/AddCustomerForm";

export default {
  title: "Stories/AddCustomerForm",
  component: AddCustomerForm,
} as Meta<typeof AddCustomerForm>;

const Template: StoryFn<typeof AddCustomerForm> = (args) => <AddCustomerForm onSubmit={()=>{}}/>;

export const Form = Template.bind({});
Form.args = {};
