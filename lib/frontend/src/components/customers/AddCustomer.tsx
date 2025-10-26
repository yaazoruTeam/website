import React from 'react'
import AddCustomerForm, { AddCustomerFormInputs } from './AddCustomerForm'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { addCustomer } from './addCustomerLogic'
import {  AxiosError } from 'axios'
import {
  AddCustomerContainer,
  HeaderWrapper,
  TitleWrapper,
} from '../designComponent/styles/customersStyles'

const AddCustomer: React.FC = () => {
  const { t } = useTranslation()

  const handleAddCustomer = async (data: AddCustomerFormInputs) => {
    try {
      const tempEntityId = 'temp-new-customer'
      const newCustomer = await addCustomer(data, tempEntityId)
      alert('הלקוח נוסף בהצלחה')
      console.log(newCustomer)
      window.location.reload()
    } catch (err: AxiosError | unknown) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        alert(`שגיאה: מספר ת.ז או אימייל כבר קיימים`)
      }
      alert(`שגיאה: ${err}`)
    }
  }

  return (
    <AddCustomerContainer>
      <HeaderWrapper>
        <TitleWrapper>
          <CustomTypography text={t('addCustomer')} variant='h1' weight='bold' color={colors.blue500} />
        </TitleWrapper>
      </HeaderWrapper>
      <AddCustomerForm onSubmit={handleAddCustomer} />
    </AddCustomerContainer>
  )
}

export default AddCustomer
