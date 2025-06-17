import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
interface PaymentFormInput {
  name: string
  mustEvery: string
  Payments: string
  startDate: Date
  dayOfTheMonth: string
  additionalField: string
}
declare global {
  interface Window {
    TzlaHostedFields: any
    fieldsInitialized: boolean
  }
}
let fields: any = null

const PaymentForm = forwardRef(
  (
    props: {
      onPaymentChange: (paymentData: any) => void
      OnTimeChange: (timeData: any) => void
      defaultValues?: PaymentFormInput
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { onPaymentChange } = props
    const { OnTimeChange } = props
    const { defaultValues } = props

    const [errors, setErrors] = useState<string[]>([])
    const [fieldsInitialized, setFieldsInitialized] = useState<boolean>(false)
    // const terminalName = process.env.TRANZILA_TERMINAL_NAME;

    const { control, watch, setValue } = useForm<PaymentFormInput>({
      defaultValues,
    })
    useImperativeHandle(ref, () => ({
      chargeCcData, // חושפים את הפונקציה החיונית
    }))
    const initializeTzlaFields = useCallback(() => {
      console.log('מנסה לטעון שדות Tranzila...')

      if (fieldsInitialized || window.fieldsInitialized) {
        console.log('השדות כבר אותחלו בעבר.')
        return
      }
      if (!window.TzlaHostedFields) {
        console.error('TzlaHostedFields אינו זמין.')
        return
      }

      fields = window.TzlaHostedFields.create({
        sandbox: true,
        fields: {
          credit_card_number: {
            selector: '#credit_card_number',
            placeholder: t('creditcardNumber'),
            tabindex: 1,
          },
          cvv: {
            selector: '#cvv',
            placeholder: 'CVV',
            tabindex: 2,
          },
          expiry: {
            selector: '#expiry',
            placeholder: 'MM/YY',
            version: '1',
          },
          identity_number: {
            selector: '#identity_number',
            placeholder: t('IdNumber'),
            tabindex: 4,
          },
        },
        styles: {
          input: {
            height: '29px',
            width: '100%',
            color: colors.c11,
          },
          select: {
            height: 'auto',
            width: 'auto',
          },
        },
      })
      console.log('tzlFields (fields):', fields)

      setFieldsInitialized(true)
      window.fieldsInitialized = true
    }, [fieldsInitialized, t])

    useEffect(() => {
      if (!window.TzlaHostedFields) {
        console.error('TzlaHostedFields לא נטען מה-scripts.')
        return
      }

      if (!fieldsInitialized) {
        initializeTzlaFields()
      }
    }, [fieldsInitialized, initializeTzlaFields])

    const chargeCcData = async () => {
      console.log('ביצוע עיסקה התחיל-----')
      if (!fields) {
        console.error('השדה fields אינו מאותחל.')
        return
      }

      console.log('פונקציות זמינות:', Object.keys(fields))

      if (typeof fields.charge !== 'function') {
        console.error('פונקציית charge אינה זמינה ב-fields.')
        return
      }

      return new Promise((resolve, reject) => {
        fields.charge(
          {
            terminal_name: 'yaazoru',
            amount: 5,
            tran_mode: 'N',
            tokenize: true,
            response_language: 'Hebrew',
          },
          (err: any, response: any) => {
            if (err) {
              handleError(err)
              reject(err)
            }
            if (response) {
              onPaymentChange(response.transaction_response)
              resolve(response)
            }
          },
        )
      })
    }

    const handleError = (err: any) => {
      console.log('העסקה נכשלה.')
      const errorMessages = err.messages.map((message: any) => message.message)
      setErrors(errorMessages)
    }

    useEffect(() => {
      const subscription = watch((value) => {
        const { name, mustEvery, Payments, startDate, dayOfTheMonth } = value
        console.log('timeData update:', { name, mustEvery, Payments, startDate, dayOfTheMonth })
        OnTimeChange({
          name: name,
          mustEvery: mustEvery,
          payments: Payments,
          startDate: startDate,
          dayOfTheMonth: dayOfTheMonth,
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

    return (
      <Box
        component='form'
        id='payment_form'
        sx={{
          width: '100%',
          height: '100%',
          padding: 4,
          backgroundColor: colors.c6,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'flex-end',
          direction: 'rtl',
        }}
      >
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
            color={colors.c2}
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
              color={colors.c11}
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
            <CustomTypography text={t('expiry')} variant='h4' weight='regular' color={colors.c11} />
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
              gap: 1, // המרחק בין האלמנטים (8px, כי 1rem = 8px)
              display: 'inline-flex',
            }}
          >
            <CustomTypography text='cvv' variant='h4' weight='regular' color={colors.c11} />
            <Box
              sx={{
                alignSelf: 'stretch',
                padding: 1, // 10px
                background: 'rgba(246, 248, 252, 0.58)',
                borderRadius: 1, // 6px
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
              color={colors.c11}
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
            color={colors.c2}
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
        {errors && (
          <Box>
            <Typography>{errors}</Typography>
          </Box>
        )}
      </Box>
    )
  },
)

export default PaymentForm
