import React, { useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../designComponent/Button'
import { useTranslation } from 'react-i18next'

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

  const {
    control,
    handleSubmit,
  } = useForm<AddCustomerFormInputs>({
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
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 1.5,
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
      }}
    >
      <Box
        sx={{
          height: '100%',
          boxShadow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            height: '100%',
            p: 3.5,
            bgcolor: 'background.paper',
            borderRadius: 0.75,
            display: 'flex',
            flexDirection: 'column',
            gap: 3.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 3.5,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
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
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 3.5,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
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
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: '66%' },
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 3.5,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
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
          </Box>
          {!hasInitialValues && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <CustomButton
                label={t('saving')}
                state='default'
                size={isMobile ? 'small' : 'large'}
                buttonType='first'
                type='submit'
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AddCustomerForm
