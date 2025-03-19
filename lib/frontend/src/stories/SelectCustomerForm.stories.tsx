import { Meta, StoryFn } from "@storybook/react";

import SelectCustomerForm from "../components/customers/SelectCustomerForm";

export default {
  title: "Stories/SelectCustomerForm",
  component: SelectCustomerForm,
} as Meta<typeof SelectCustomerForm>;

const Template: StoryFn<typeof SelectCustomerForm> = (args) => <SelectCustomerForm />;

export const Form = Template.bind({});
Form.args = {};
