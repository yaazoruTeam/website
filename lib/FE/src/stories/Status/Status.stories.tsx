import { Meta, StoryFn } from '@storybook/react'
import Status from '../../components/designComponent/Status'

export default {
  title: 'Components/Status',
  component: Status,
} as Meta<typeof Status>

const Template: StoryFn<typeof Status> = (args: any) => <Status {...args} />

export const Active = Template.bind({})
Active.args = {
  status: 'active',
}

export const Inactive = Template.bind({})
Inactive.args = {
  status: 'inactive',
}

export const Pending = Template.bind({})
Pending.args = {
  status: 'blocked',
}
