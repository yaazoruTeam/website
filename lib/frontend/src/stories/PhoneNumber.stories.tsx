import { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../styles/theme'
import PhoneNumber from '../components/switchboard/PhoneNumer'

export default {
  title: 'Stories/PhoneNumber',
  component: PhoneNumber,
  argTypes: {
    status: {
      control: 'radio',
      options: ['active', 'inactive'],
    },
  },
} as Meta<typeof PhoneNumber>

const Template: StoryFn<typeof PhoneNumber> = (args) => (
  <ThemeProvider theme={theme}>
    <PhoneNumber {...args} />
  </ThemeProvider>
)

export const DefaultPhoneNumberStory = Template.bind({})
DefaultPhoneNumberStory.args = {
  phoneNumber: '123-456-7890',
  country: 'England',
}
