import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Box, Typography, Alert, CircularProgress } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { useTranzilaHostedFields } from '../../hooks/useTranzilaHostedFields'
import type { TzlaHostedFieldsResponse } from '../../tranzila'

interface PaymentFormInput {
  name: string
  mustEvery: string
  Payments: string
  startDate: Date
  dayOfTheMonth: string
  additionalField: string
}

export interface PaymentFormHandle {
  chargeCcData: (amount: number) => Promise<TzlaHostedFieldsResponse>
}

const PaymentForm = forwardRef<
  PaymentFormHandle,
  {
    onPaymentChange: (paymentData: TzlaHostedFieldsResponse) => void
    OnTimeChange: (timeData: {
      name: string
      mustEvery: string
      payments: string
      startDate: Date
      dayOfTheMonth: string
    }) => void
    defaultValues?: PaymentFormInput
  }
>(({ onPaymentChange, OnTimeChange, defaultValues }, ref) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    isInitialized,
    isLoading: tranzilaLoading,
    error: tranzilaError,
    charge,
  } = useTranzilaHostedFields({
    enabled: true,
    sandbox: true,
    onSuccess: (response) => {
      onPaymentChange(response)
      setErrors([])
    },
    onError: (errors) => {
      setErrors(errors.map(error => error.message))
    },
  })

  const { control, watch, setValue } = useForm<PaymentFormInput>({
    defaultValues,
  })

  const chargeCcData = async (amount: number = 5): Promise<TzlaHostedFieldsResponse> => {
    if (!isInitialized) {
      throw new Error('Tranzila fields not initialized')
    }

    setIsProcessing(true)
    setErrors([])

    try {
      const response = await charge({
        amount,
        tran_mode: 'N',
        tokenize: true,
        response_language: 'Hebrew',
      })
      
      console.log('Payment processed successfully:', response)
      return response
    } catch (error) {
      console.error('Payment processing failed:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  useImperativeHandle(ref, () => ({
    chargeCcData,
  }), [chargeCcData])

  useEffect(() => {
    const subscription = watch((value) => {
      const { name, mustEvery, Payments, startDate, dayOfTheMonth } = value
      console.log('timeData update:', { name, mustEvery, Payments, startDate, dayOfTheMonth })
      OnTimeChange({
        name: name || '',
        mustEvery: mustEvery || '',
        payments: Payments || '',
        startDate: startDate || new Date(),
        dayOfTheMonth: dayOfTheMonth || '',
      })
    })

    return () => subscription.unsubscribe()
  }, [watch, OnTimeChange])

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name)
      setValue('mustEvery', defaultValues.mustEvery)
      setValue('Payments', defaultValues.Payments)
      setValue('startDate', defaultValues.startDate)
      setValue('dayOfTheMonth', defaultValues.dayOfTheMonth)
    }
  }, [defaultValues, setValue])

  // Show loading state while Tranzila is loading
  if (tranzilaLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('loadingPaymentFields')}</Typography>
      </Box>
    )
  }

  return (
    <Box
      component='form'
      id='payment_form'
      sx={{
        width: '100%',
        height: '100%',
        padding: 4,
        backgroundColor: colors.neutral0,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-end',
        direction: 'rtl',
      }}
    >
      {/* Show Tranzila errors */}
      {tranzilaError && (
        <Alert severity="error" sx={{ width: '100%', direction: 'rtl' }}>
          {tranzilaError}
        </Alert>
      )}

      {/* Show field errors */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ width: '100%', direction: 'rtl' }}>
          <ul style={{ margin: 0, paddingRight: '20px' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Show processing state */}
      {isProcessing && (
        <Alert severity="info" sx={{ width: '100%', direction: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {t('processingPayment')}
          </Box>
        </Alert>
      )}

      <Box
        sx={{
          width: '100%',
          direction: 'rtl',
        }}
      >
        <CustomTypography
          text={t('paymentDetails')}
          variant='h2'
          weight='medium'
          color={colors.blue600}
        />
      </Box>
      <Box
        sx={{
          alignSelf: 'stretch',
          height: 90,
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 4,
          display: 'inline-flex',
        }}
      >
        {/* מס' כרטיס*/}
        <Box
          sx={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 1,
            display: 'inline-flex',
          }}
        >
          <CustomTypography
            text={t('creditcardNumber')}
            variant='h4'
            weight='regular'
            color={colors.blue900}
          />
          <Box
            sx={{
              alignSelf: 'stretch',
              padding: 1,
              background: 'rgba(246, 248, 252, 0.58)',
              borderRadius: 1,
            }}
          >
            <div id='credit_card_number' style={{ width: '100%', height: '44px' }}></div>
          </Box>
        </Box>
        {/* תוקף */}
        <Box
          sx={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 1,
            display: 'inline-flex',
          }}
        >
          <CustomTypography text={t('expiry')} variant='h4' weight='regular' color={colors.blue900} />
          <Box
            sx={{
              alignSelf: 'stretch',
              padding: 1,
              background: 'rgba(246, 248, 252, 0.58)',
              borderRadius: 1,
            }}
          >
            <div id='expiry' style={{ width: '100%', height: '44px' }}></div>
          </Box>
        </Box>
        {/* CVV */}
        <Box
          sx={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 1,
            display: 'inline-flex',
          }}
        >
          <CustomTypography text='cvv' variant='h4' weight='regular' color={colors.blue900} />
          <Box
            sx={{
              alignSelf: 'stretch',
              padding: 1,
              background: 'rgba(246, 248, 252, 0.58)',
              borderRadius: 1,
            }}
          >
            <div id='cvv' style={{ width: '100%', height: '44px' }}></div>
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 1,
            display: 'inline-flex',
          }}
        >
          <CustomTypography
            text={t('IdNumber')}
            variant='h4'
            weight='regular'
            color={colors.blue900}
          />
          <Box
            sx={{
              alignSelf: 'stretch',
              padding: 1,
              background: 'rgba(246, 248, 252, 0.58)',
              borderRadius: 1,
            }}
          >
            <div id='identity_number' style={{ width: '100%', height: '44px' }}></div>
          </Box>
        </Box>
        <CustomTextField
          control={control}
          name='name'
          label={t('cardholderName')}
          placeholder={t('cardholderName')}
        />
      </Box>
      <Box
        sx={{
          direction: 'rtl',
          width: '100%',
        }}
      >
        <CustomTypography
          text={t('billingDate')}
          variant='h2'
          weight='medium'
          color={colors.blue600}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <CustomTextField
            control={control}
            label={t('startDate')}
            placeholder='20/12/24'
            name='startDate'
            type='date'
          />
        </Box>
        <Box>
          <CustomTextField
            control={control}
            label={t('payments')}
            name='Payments'
            placeholder='0'
          />
        </Box>
        <Box>
          <CustomTextField
            control={control}
            label={t('mustEvery')}
            name='mustEvery'
            placeholder={t('numberMonths')}
          />
        </Box>
        <Box>
          <CustomTextField
            control={control}
            label={t('dayOfTheMonth')}
            name='dayOfTheMonth'
            placeholder='10'
          />
        </Box>
      </Box>
    </Box>
  )
})

export default PaymentForm
