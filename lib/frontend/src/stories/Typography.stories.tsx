// TypographyComponent.stories.tsx
import { Meta, StoryFn } from '@storybook/react'
import CustomTypography from '../components/designComponent/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../styles/theme'
// import theme from '../styles/theme';  // יש להקפיד לייבא את ה-theme הנכון

export default {
  title: 'Typography/CustomTypography',
  component: CustomTypography,
  argTypes: {
    weight: {
      control: {
        type: 'radio',
        options: ['regular', 'medium', 'bold'], // אפשרויות למשקל
      },
      defaultValue: 'regular',
    },
    text: {
      control: 'text', // אפשרות להזין טקסט בצורה דינמית
      defaultValue: 'Text Example',
    },
    variant: {
      control: {
        type: 'radio',
        options: ['h1', 'h2', 'h3', 'h4', 'h5'], // אפשרות לבחור את סוג ה-H
      },
      defaultValue: 'h1', // ברירת מחדל היא h1
    },
  },
} as Meta

const Template: StoryFn<any> = (args) => (
  <ThemeProvider theme={theme}>
    {' '}
    {/* עטוף את הקומפוננטה ב-ThemeProvider */}
    <CustomTypography {...args} />
  </ThemeProvider>
)

export const Default = Template.bind({})
Default.args = {
  weight: 'regular',
  text: 'דוגמא לטקסט',
  variant: 'h4', // ברירת מחדל היא h1
}
