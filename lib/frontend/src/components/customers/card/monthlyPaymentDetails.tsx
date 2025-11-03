import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Customer, MonthlyPayment } from '@model'
import CustomTypography from '../../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { colors } from '../../../styles/theme'
import { getMonthlyPaymentByCustomerId } from '../../../api/monhlyPaymentApi'
import MonthlyPaymentList from '../../monthlyPayment/MonthlyPaymentList'

const MonthlyPaymentDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
  const { t } = useTranslation()
  const [monthlyPayment, setMonthlyPayment] = useState<MonthlyPayment.Model[]>([])

  useEffect(() => {
    const getMonthlyPayments = async (customer_id: number) => {
      const { data } =
        await getMonthlyPaymentByCustomerId(customer_id.toString(), 1)
      setMonthlyPayment(data)
    }
    getMonthlyPayments(customer.customer_id)
  }, [customer])

  return (
    <Box>
      <Box
        sx={{
          paddingBottom: '20px',
        }}
      >
        <CustomTypography
          text={t('standingOrders')}
          variant='h1'
          weight='bold'
          color={colors.blue900}
        />
      </Box>
      <MonthlyPaymentList
        monthlyPayment={monthlyPayment} isCustomerCard={true} />
    </Box>
  )
}

export default MonthlyPaymentDetails
