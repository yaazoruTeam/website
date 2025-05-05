import { Meta, StoryFn } from "@storybook/react";
import CustomTabs from "../components/designComponent/Tab";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../styles/theme";

export default {
  title: "Stories/CustomTabs",
  component: CustomTabs,
} as Meta<typeof CustomTabs>;

const tabs = [
    { label: 'פרטי תשלום', content: <div>תוכן פרטי תשלום</div> },
    { label: 'פרטי לקוח', content: <div>תוכן פרטי לקוח</div> },
    { label: 'היסטוריית הזמנות', content: <div>תוכן היסטוריית הזמנות</div> },
    { label: 'היסטוריית לקוחות', content: <div>תוכן היסטוריית לקוחות ---</div> },
  ];

const Template: StoryFn<typeof CustomTabs> = (args) => 
 <ThemeProvider theme={theme}>
    <CustomTabs tabs={tabs}/>
</ThemeProvider>
;

export const Tab = Template.bind({});
Tab.args = {};
