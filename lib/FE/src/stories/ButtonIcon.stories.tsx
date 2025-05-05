import { Meta, StoryFn } from "@storybook/react";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../styles/theme";
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { CustomIconButton } from "../components/designComponent/ButtonIcon";

export default {
    title: "Stories/CustomIconButton",
    component: CustomIconButton,
    argTypes: {
        disabled: { control: "boolean" },
    },
} as Meta<typeof CustomIconButton>;

const Template: StoryFn<typeof CustomIconButton> = (args) => (
    <ThemeProvider theme={theme}> {/* עטוף את הקומפוננטה ב-ThemeProvider */}
        <CustomIconButton {...args} />
    </ThemeProvider>);

export const ExampleRegularButton = Template.bind({});
ExampleRegularButton.args = {
    size: 'large',
    buttonType: 'first',
    state: 'default',
    icon: <Cog6ToothIcon />
};
// className="h-5 w-5"