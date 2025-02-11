import { Meta, StoryFn } from "@storybook/react";
import CustomSelect from "./CustomSelect";
import { useForm } from "react-hook-form";

export default {
    title: "Stories/CustomSelect",
    component: CustomSelect,
    argTypes: {
        disabled: { control: "boolean" },
    },
} as Meta<typeof CustomSelect>;

const Template: StoryFn<typeof CustomSelect> = (args) => {
    const { control } = useForm();
    return <CustomSelect {...args} control={control} />;
};


export const SelectField = Template.bind({});
SelectField.args = {
    label: "סוג תשלום",
    name: 'type',
    options: [{ label: 'הוראת קבע', value: 'הוראת קבע' }, { label: 'תשלום חד פעמי', value: 'תשלום חד פעמי' }]
};