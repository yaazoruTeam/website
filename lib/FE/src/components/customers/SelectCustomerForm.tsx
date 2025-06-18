import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { CustomTextField } from '../designComponent/Input'
import { Customer } from '../../model/src'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

interface SelectCustomerFormInputs {
  full_name: string
  email?: string
  phone_number?: string
}

interface SelectCustomerFormProps {
  customer?: Customer.Model | null
  onNameClick?: (event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>) => void
  onNameChange?: (name: string) => void
}

const SelectCustomerForm: React.FC<SelectCustomerFormProps> = ({
  customer,
  onNameClick,
  onNameChange,
}) => {
  const { control, setValue, watch } = useForm<SelectCustomerFormInputs>({
    defaultValues: {
      full_name: customer ? `${customer.first_name} ${customer.last_name}` : '',
    },
  })
  const { t } = useTranslation()
  const customerName = watch('full_name')

  useEffect(() => {
    if (customer) {
      setValue('full_name', customer.first_name + ' ' + customer.last_name)
      setValue('email', customer.email)
      setValue('phone_number', customer.phone_number)
    } else {
      setValue('full_name', '')
      setValue('email', '')
      setValue('phone_number', '')
    }
  }, [customer, t, setValue])

  useEffect(() => {
    onNameChange?.(customerName)
  }, [customerName, onNameChange])
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('full_name', e.target.value)
    if (onNameClick) {
      onNameClick(e)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: 3.5,
        backgroundColor: colors.c6,
        borderRadius: 1,
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        gap: 3.5,
        direction: 'rtl',
      }}
    >
      <Box
        sx={{
          direction: 'rtl',
          width: '100%',
        }}
      >
        <CustomTypography
          text={t('customerDetails')}
          variant='h2'
          weight='medium'
          color={colors.c2}
        />

        <Box
          sx={{
            width: '100%',
            alignSelf: 'stretch',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            gap: 3.5,
            display: 'inline-flex',
          }}
        >
          <Box
            sx={{
              width: 393.33,
              height: 90,
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            <CustomTextField
              control={control}
              name='full_name'
              label={t('selectCustomer')}
              placeholder={t('typeCustomerName')}
              icon={customer ? <PencilSquareIcon /> : <PlusCircleIcon />}
              onClick={onNameClick}
              onChange={handleNameChange}
              sx={{
                textAlign: 'right',
                direction: 'rtl',
              }}
            />
          </Box>
          <Box
            sx={{
              width: 393.33,
              height: 90,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 1,
              display: 'inline-flex',
              visibility: customer ? 'visible' : 'hidden',
            }}
          >
            <CustomTextField
              control={control}
              name='customerPhone'
              label={t('phone')}
              placeholder={customer?.phone_number || t('phone')}
              disabled
            />
          </Box>
          <Box
            sx={{
              width: 393.33,
              height: 90,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 1,
              display: 'inline-flex',
              visibility: customer ? 'visible' : 'hidden',
            }}
          >
            <CustomTextField
              control={control}
              name='customerEmail'
              label={t('email')}
              placeholder={customer?.email || t('email')}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectCustomerForm
