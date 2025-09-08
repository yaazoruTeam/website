import React, { useEffect } from 'react'
import { useMediaQuery } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../designComponent/Button'
import { useTranslation } from 'react-i18next'
import {
  FormContainer,
  OuterCard,
  InnerContent,
  FieldsRow,
  AddressRow,
  ActionsRow,
} from '../designComponent/styles/customersStyles' // ← הנתיב בהתאם לפרויקט שלך

interface AddCustomerFormProps {
  onSubmit: (data: AddCustomerFormInputs) => void
  initialValues?: AddCustomerFormInputs
  setSubmitHandler?: (submit: () => void) => void
}

export interface AddCustomerFormInputs {
  first_name: string
  last_name: string
  id_number: string
  phone_number: string
  additional_phone: string
  email: string
  address: string
  city: string
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onSubmit,
  initialValues,
  setSubmitHandler,
}) => {
  const { t } = useTranslation()

  const { control, handleSubmit } = useForm<AddCustomerFormInputs>({
    defaultValues: initialValues || {
      first_name: '',
      last_name: '',
      id_number: '',
      phone_number: '',
      additional_phone: '',
      email: '',
      address: '',
      city: '',
    },
  })

  useEffect(() => {
    if (setSubmitHandler) {
      setSubmitHandler(handleSubmit(onSubmit))
    }
  }, [handleSubmit, onSubmit, setSubmitHandler])

  const isMobile = useMediaQuery('(max-width:600px)')
  const hasInitialValues = !!initialValues

  return (
    <FormContainer component='form' onSubmit={handleSubmit(onSubmit)}>
      <OuterCard>
        <InnerContent>
          <FieldsRow isMobile={isMobile}>
            <CustomTextField
              name='first_name'
              label={t('firstName')}
              rules={{
                required: t('requiredField'),
                maxLength: {
                  value: 50,
                  message: t('maxLength', { max: 50 }),
                },
              }}
              control={control}
            />
            <CustomTextField
              control={control}
              name='last_name'
              label={t('lastName')}
              rules={{
                required: t('requiredField'),
                maxLength: {
                  value: 50,
                  message: t('maxLength', { max: 50 }),
                },
              }}
            />
            <CustomTextField
              control={control}
              name='id_number'
              label={t('IdNumber')}
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^\d{9}$/,
                  message: t('errorIdNumber'),
                },
              }}
            />
          </FieldsRow>

          <FieldsRow isMobile={isMobile}>
            <CustomTextField
              control={control}
              name='phone_number'
              label={t('phone')}
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^[\d\s\-\+\(\)]{9,15}$/,
                  message: t('errorPhone'),
                },
              }}
            />
            <CustomTextField
              control={control}
              name='additional_phone'
              label={t('additionalPhone')}
              rules={{
                pattern: {
                  value: /^[\d\s\-\+\(\)]{9,15}$/,
                  message: t('errorPhone'),
                },
              }}
            />
            <CustomTextField
              control={control}
              name='email'
              label={t('email')}
              type='email'
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('errorEmail'),
                },
              }}
            />
          </FieldsRow>

          <AddressRow isMobile={isMobile}>
            <CustomTextField
              control={control}
              name='address'
              label={t('address')}
              rules={{
                required: t('requiredField'),
              }}
            />
            <CustomTextField
              control={control}
              name='city'
              label={t('city')}
              rules={{
                required: t('requiredField'),
              }}
            />
          </AddressRow>

          {!hasInitialValues && (
            <ActionsRow>
              <CustomButton
                label={t('saving')}
                state='default'
                size={isMobile ? 'small' : 'large'}
                buttonType='first'
                type='submit'
              />
            </ActionsRow>
          )}
        </InnerContent>
      </OuterCard>
    </FormContainer>
  )
}

export default AddCustomerForm
