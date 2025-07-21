import { StoryFn, Meta } from '@storybook/react'
import CustomerStatus from '../components/designComponent/StatusCard'

export default {
  title: 'Components/CustomerStatus',
  component: CustomerStatus,
} as Meta

const Template: StoryFn = () => (
  <CustomerStatus onStatusSelect={async (status) => { console.log(status); }} />
)
export const Default = Template.bind({})
Default.args = {}
