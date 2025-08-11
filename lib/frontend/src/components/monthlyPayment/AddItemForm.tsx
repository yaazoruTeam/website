import React, { useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import { CustomTextField } from '../designComponent/Input'
import CustomSelect from '../designComponent/CustomSelect'
import { CustomButton } from '../designComponent/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { ItemForMonthlyPayment } from '@model'
import { useTranslation } from 'react-i18next'
import { colors } from '../../styles/theme'

interface ItemFormProps {
  onSubmit: (data: ItemForMonthlyPayment.Model) => void
  initialValues?: ItemForMonthlyPayment.Model | null
  setFormAddItem?: React.Dispatch<React.SetStateAction<boolean>>
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialValues, setFormAddItem }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width:600px)')
  const { control, handleSubmit, reset, watch, setValue } = useForm<ItemForMonthlyPayment.Model>({
    defaultValues: {
      description: '',
      quantity: '',
      price: '',
      total: '',
      paymentType: t('standingOrder'),
    },
  })
  const quantity = watch('quantity')
  const price = watch('price')

  useEffect(() => {
    if (quantity && price) {
      const total = Number(quantity) * Number(price)
      setValue('total', total)
    }
  }, [quantity, price, setValue])

  useEffect(() => {
    if (initialValues) {
      reset(initialValues)
    }
  }, [initialValues, reset])

  const onFormSubmit = (data: ItemForMonthlyPayment.Model) => {
    onSubmit(data)
    reset({
      description: '',
      quantity: '',
      price: '',
      total: '',
      paymentType: t('standingOrder'),
    })
  }

  return (
    <Box
      style={{
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 24,
        display: 'inline-flex',
      }}
    >
      <CustomSelect
        label={t('paymentType')}
        name='paymentType'
        control={control}
        options={[
          { label: t('standingOrder'), value: t('standingOrder') },
          { label: t('oneTimePayment'), value: t('oneTimePayment') },
        ]}
      />
      <CustomTextField
        label={t('description')}
        name='description'
        control={control}
        placeholder={t('InstructionForDescription')}
      />
      <CustomTextField
        label={t('amount')}
        name='quantity'
        control={control}
        placeholder={t('InstructionForAmount')}
      />
      <CustomTextField label={t('price')} name='price' control={control} placeholder={t('price')} />
      <CustomTextField label={t('total')} name='total' control={control} placeholder='₪ 0.00' />
      <Box
        style={{
          flex: '1 1 0',
          height: 50,
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
          display: 'flex',
        }}
      >
        <CustomButton
          label={t('approval')}
          size={isMobile ? 'small' : 'large'}
          state='hover'
          buttonType='first'
          onClick={handleSubmit(onFormSubmit)}
        />
        <TrashIcon
          style={{ width: '24px', height: '24px', color: colors.c2, cursor: 'pointer' }}
          onClick={() => (setFormAddItem ? setFormAddItem(false) : '')}
        />
      </Box>
    </Box>
  )
}

export default ItemForm
