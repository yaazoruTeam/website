import { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../styles/theme'
import CustomSwitch from '../components/designComponent/Switch'

export default {
  title: 'Stories/CustomSwitch',
  component: CustomSwitch,
  argTypes: {
    status: {
      control: 'radio',
      options: ['active', 'inactive'],
    },
  },
} as Meta<typeof CustomSwitch>

const Template: StoryFn<typeof CustomSwitch> = (args) => (
  <ThemeProvider theme={theme}>
    <CustomSwitch {...args} />
  </ThemeProvider>
)

export const DefaultSwitchStory = Template.bind({})
DefaultSwitchStory.args = {
  initialChecked: true,
  onChange: (checked: boolean) => console.log('Switch changed:', checked),
}
