import { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../styles/theme'
import CustomRadioBox from '../components/designComponent/RadioBox'

export default {
  title: 'Stories/CustomRadioBox',
  component: CustomRadioBox,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} as Meta<typeof CustomRadioBox>

const Template: StoryFn<typeof CustomRadioBox> = (args) => (
  <ThemeProvider theme={theme}>
    {' '}
    {/* עטוף את הקומפוננטה ב-ThemeProvider */}
    <CustomRadioBox {...args} />
  </ThemeProvider>
)

export const RadioBox = Template.bind({})
RadioBox.args = {
  options: [
    { label: 'hi', value: 'hi' },
    { label: 'gg', value: 'gg' },
  ],
  // defaultValue:'label2'
}
// className="h-5 w-5"
