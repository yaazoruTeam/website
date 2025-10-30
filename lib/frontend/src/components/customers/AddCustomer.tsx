import React from 'react'
import { useNavigate } from 'react-router-dom'
import AddCustomerForm, { AddCustomerFormInputs } from './AddCustomerForm'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { addCustomer } from './addCustomerLogic'
import { TempComment } from '@model'
import {  AxiosError } from 'axios'
import {
  AddCustomerContainer,
  HeaderWrapper,
  TitleWrapper,
} from '../designComponent/styles/customersStyles'

const AddCustomer: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleAddCustomer = async (data: AddCustomerFormInputs, localComments?: TempComment.Model[]) => {
    try {
      await addCustomer(data, localComments)
      alert(t('customerAddedSuccessfully'))
      navigate('/customers')
    } catch (err: AxiosError | unknown) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        alert(t('errorDuplicateIdOrEmail'))
      } else {
        alert(`${t('error')}: ${err}`)
      }
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
