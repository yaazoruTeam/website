import { StoryFn, Meta } from '@storybook/react'
import { useForm, FormProvider } from 'react-hook-form'
import CustomSearchSelect from '../../components/designComponent/CustomSearchSelect'

export default {
  title: 'Components/CustomSearchSelect',
  component: CustomSearchSelect,
} as Meta

const Template: StoryFn<typeof CustomSearchSelect> = (args) => {
  const methods = useForm()
  return (
    <FormProvider {...methods}>
      <CustomSearchSelect
        placeholder='תאריך לפי טווח'
        {...args}
        searchType='date'
      />
    </FormProvider>
  )
}

export const Default = Template.bind({})
Default.args = {}
