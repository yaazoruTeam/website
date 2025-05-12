import { Meta, StoryFn } from "@storybook/react";

import ItemForm from "../../components/monthlyPayment/AddItemForm";

export default {
    title: "Stories/ItemForm",
    component: ItemForm,
} as Meta<typeof ItemForm>;

const Template: StoryFn<typeof ItemForm> = () => <ItemForm onSubmit={() => { }} />;

export const Form = Template.bind({});
Form.args = {};
