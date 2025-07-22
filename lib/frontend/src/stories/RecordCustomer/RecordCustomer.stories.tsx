import { Meta, StoryFn } from '@storybook/react'
import { RecordCustomer } from './RecordCustomer'

export default {
  title: 'Stories/RecordCustomer',
  component: RecordCustomer,
} as Meta<typeof RecordCustomer>

const Template: StoryFn<typeof RecordCustomer> = () => (
  <RecordCustomer email='e@gmail.com' name='אפרת גרינבוים' phone='053-987-6587' />
)

export const Record = Template.bind({})
Record.args = {}
