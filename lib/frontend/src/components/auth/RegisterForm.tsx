import React, { useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../designComponent/Button'
import { useTranslation } from 'react-i18next'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormInputs) => void
  initialValues?: RegisterFormInputs
  setSubmitHandler?: (submit: () => void) => void
}

export interface RegisterFormInputs {
  first_name: string
  last_name: string
  id_number: string
  phone_number: string
  email: string
  city: string
  address1: string
  password: string
  user_name: string
  zipCode: string
  role: string
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  initialValues,
  setSubmitHandler,
}) => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
  } = useForm<RegisterFormInputs>({
    defaultValues: initialValues || {
      first_name: '',
      last_name: '',
      id_number: '',
      phone_number: '',
      email: '',
      city: '',
      address1: '',
      password: '',
      user_name: '',
      zipCode: '',
      role: 'admin',
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
      sx={{
        width: '100%',
        padding: 6,
        backgroundColor: colors.c6,
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2.5,
        display: 'inline-flex',
        direction: 'rtl',
      }}
    >
      <CustomTypography
        text="הוספת משתמש חדש למערכת"
        variant='h1'
        weight='bold'
        color={colors.c11}
        sx={{
          textAlign: 'center',
          marginBottom: 3,
        }}
      />

      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
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
                value: /^[\d\s\-+()]{9,15}$/,
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
          <CustomTextField
            control={control}
            name='city'
            label={t('city')}
            rules={{
              required: t('requiredField'),
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
            name='address1'
            label={t('address')}
            rules={{
              required: t('requiredField'),
            }}
          />
          <CustomTextField
            control={control}
            name='zipCode'
            label="מיקוד"
            rules={{
              pattern: {
                value: /^\d{5,7}$/,
                message: 'מיקוד חייב להיות בין 5 ל-7 ספרות',
              },
            }}
          />
          <CustomTextField
            control={control}
            name='user_name'
            label={t('userName')}
            rules={{
              required: t('requiredField'),
              minLength: {
                value: 3,
                message: 'שם המשתמש חייב להיות לפחות 3 תווים',
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
            name='password'
            label={t('password')}
            type='password'
            rules={{
              required: t('requiredField'),
              minLength: {
                value: 6,
                message: 'הסיסמה חייבת להיות לפחות 6 תווים',
              },
            }}
          />
        </Box>

        {!hasInitialValues && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
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
  )
}

export default RegisterForm
