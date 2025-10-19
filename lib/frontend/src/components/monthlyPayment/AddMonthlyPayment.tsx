import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomerSelector from '../customers/CustomerSelector'
import PaymentForm, { PaymentFormHandle } from './PaymentForm'
import FormToAddItems from './FormToAddItems'
import { CustomButton } from '../designComponent/Button'
import { Customer, ItemForMonthlyPayment, MonthlyPaymentManagement } from '@model'
import { useMediaQuery } from '@mui/material'
import { createMonthlyPayment } from '../../api/monthlyPaymentManagement'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/system'

export interface AddMonthlyPaymentFormInputs {
  full_name: string
}

const AddMonthlyPayment: React.FC = () => {
  const { t } = useTranslation()
  const [customerData, setCustomerData] = useState<Customer.Model | null>(null) // נתוני לקוח
  const [itemsData, setItemsData] = useState<ItemForMonthlyPayment.Model[]>([]) // נתוני פריטים
  const [paymentData, setPaymentData] = useState<any>(null) // נתוני תשלום//to do:Change to an accurate type 
  const [timeData, setTimeData] = useState<any>(null) // נתוני זמן ההוראת קבע //to do:Change to an accurate type
  const paymentFormRef = useRef<PaymentFormHandle | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')
  const navigate = useNavigate()

  const addMonthlyPayment = useCallback(async () => {
    //כםן יתבצעו הקריםות שרת
    console.log('Adding monthly payment:', {
      customerData,
      itemsData,
      paymentData,
      timeData,
    })
    let amount = 0
    let oneTimePayment = 0
    itemsData.forEach((item) => {
      if (item.paymentType === t('standingOrder')) amount += parseFloat(item.total.toString())
      if (item.paymentType === t('oneTimePayment'))
        oneTimePayment += parseFloat(item.total.toString())
    })

    const monthlyPaymentManagement: MonthlyPaymentManagement.Model = {
      customer_id: customerData?.customer_id || '',
      monthlyPayment: {
        monthlyPayment_id: '',
        customer_id: customerData?.customer_id || '',
        customer_name: `${customerData?.first_name || ''} ${customerData?.last_name || ''}`,
        belongsOrganization: 'יעזורו',
        start_date: timeData.startDate,
        end_date: calculateEndDate(
          timeData.startDate,
          parseInt(timeData.payments),
          parseInt(timeData.mustEvery),
        ),
        amount: amount,
        total_amount: amount * timeData.payments,
        oneTimePayment: oneTimePayment,
        frequency: timeData.mustEvery,
        amountOfCharges: timeData.payments,
        dayOfTheMonth: timeData.dayOfTheMonth,
        next_charge: timeData.startDate,
        last_attempt: new Date('01-01-2000'),
        last_sucsse: new Date('01-01-2000'),
        created_at: new Date(Date.now()),
        update_at: new Date(Date.now()),
        status: 'active',
      },
      creditDetails: {
        credit_id: '',
        customer_id: customerData?.customer_id || '',
        token: paymentData?.token || '',
        expiry_month: paymentData?.expiry_month || '',
        expiry_year: paymentData?.expiry_year || '',
        created_at: new Date(Date.now()),
        update_at: new Date(Date.now()),
      },
      paymentCreditLink: {
        paymentCreditLink_id: '',
        creditDetails_id: '000',
        monthlyPayment_id: '000',
        status: 'active',
      },
      payments: [],
      items: itemsData.map((item) => {
        return {
          item_id: '', // תוכל להשאיר את זה ריק אם זה נתון אוטומטי שיתמלא במסד נתונים
          monthlyPayment_id: '10000', // שים את ה-ID של monthlyPayment כאן ברגע שיתקבל
          description: item.description,
          paymentType: item.paymentType,
          price: item.price, // מחיר לפי הנתונים שמגיעים מ- itemData
          quantity: item.quantity, // כמות לפי הנתונים
          total: item.total, // סכום כולל לפי הנתונים
          created_at: new Date(Date.now()), // תאריך יצירה
          update_at: new Date(Date.now()), // תאריך עדכון
        }
      }),
    }

    try {
      const createNewMonthlyPayment = await createMonthlyPayment(monthlyPaymentManagement)
      console.log(createNewMonthlyPayment)
      alert('ההוראת קבע נוספה בהצלחה!')
      navigate('/monthlyPayment')
    } catch (error) {
      console.error('Error creating monthly payment:', error)
    }
  }, [customerData, itemsData, paymentData, timeData, navigate, t])

  useEffect(() => {
    if (paymentData) {
      console.log('הנתונים עודכנו:', paymentData)
    }
    // בדיקה אם כל הנתונים קיימים
    if (!customerData || !itemsData.length || !paymentData || !timeData) {
      console.error('לא כל הנתונים מוכנים!')
      return // אם יש נתון חסר, לא נבצע את קריאות השרת
    } else {
      console.log('ניתן לבצע את הקריאות לשרת----------בהצלחה!!!')
      addMonthlyPayment()
    }
  }, [paymentData, itemsData.length, customerData, timeData, addMonthlyPayment]) // זה יתעדכן כשתהיה עדכון ב-paymentData

  useEffect(() => {
    console.log('נתוני הזמן המעודכנים:', timeData)
  }, [timeData])

  const calculateEndDate = (
    startDate: Date,
    numberOfCharges: number,
    chargeIntervalMonths: number,
  ): Date => {
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + chargeIntervalMonths * (numberOfCharges - 1))
    return endDate
  }

  const charge = async () => {
    console.log('Adding monthly payment:', {
      customerData,
      itemsData,
      paymentData,
      timeData,
    })
    try {
      // Calculate total amount to charge
      let totalAmount = 0
      itemsData.forEach((item) => {
        totalAmount += parseFloat(item.total.toString())
      })
      
      const responsePayment: any = await paymentFormRef.current?.chargeCcData(totalAmount) //to do:Change to an accurate type
      console.log('Payment completed')
      console.log(responsePayment)
      console.log('paymentData:', paymentData)
    } catch (error) {
      console.error('Error during payment:', error)
    }
  }

  return (
    <>
      <CustomerSelector onCustomerSelect={setCustomerData} />
      <FormToAddItems onItemsChange={setItemsData} />
      <PaymentForm
        ref={paymentFormRef}
        onPaymentChange={setPaymentData}
        OnTimeChange={setTimeData}
      />
      <Box
        sx={{
          direction: 'ltr',
          width: '100%',
        }}
      >
        <CustomButton
          label={t('saving')}
          size={isMobile ? 'small' : 'large'}
          state='default'
          buttonType='first'
          onClick={charge}
        />
      </Box>
    </>
  )
}
export default AddMonthlyPayment
