import { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../styles/theme'
import CustomTooltip from '../components/designComponent/Tooltip'
import { CustomButton } from '../components/designComponent/Button'

export default {
  title: 'Stories/CustomTooltip',
  component: CustomTooltip,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} as Meta<typeof CustomTooltip>

const Template: StoryFn<typeof CustomTooltip> = (args) => (
  <ThemeProvider theme={theme}>
    {' '}
    {/* עטוף את הקומפוננטה ב-ThemeProvider */}
    <CustomTooltip {...args} />
  </ThemeProvider>
)

export const RadioBox = Template.bind({})
RadioBox.args = {
  children: <CustomButton label='היי' state='default' size='large' />,
  position: 'top',
  variant: 'secondary',
  text: 'אני טולטיפ',
}
