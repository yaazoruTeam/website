import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { MonthlyPayment } from '@model'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from '../designComponent/CustomTable'
import { getCustomerById } from '../../api/customerApi'
import { formatDateToString } from '../designComponent/FormatDate'
import { PencilIcon } from '@heroicons/react/24/outline'

interface MonthlyPaymentListProps {
  monthlyPayment: MonthlyPayment.Model[]
  isCustomerCard?: boolean
  page?: number
  totalPages?: number
  total?: number
  onPageChange?: (page: number) => void
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({
  monthlyPayment,
  isCustomerCard = false,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const limit = import.meta.env.VITE_LIMIT ? parseInt(import.meta.env.VITE_LIMIT) : 10

  // תיקון: הגדרת סטייט לנתוני לקוחות
  const [customerData, setCustomerData] = useState<{ [key: string]: { name: string, id: string } }>({})

  useEffect(() => {
    const fetchCustomerNames = async () => {
      const data: { [key: string]: { name: string, id: string } } = {}
      for (const payment of monthlyPayment) {
        const customer = await getCustomerById(payment.customer_id)
        data[payment.customer_id] = {
          name: `${customer.first_name} ${customer.last_name}`,
          id: customer.id_number,
        }
      }
      setCustomerData(data)
    }

    fetchCustomerNames()
  }, [monthlyPayment])

  const onClickMonthlyPayment = (monthlyPayment: MonthlyPayment.Model) => {
    navigate(`/monthlyPayment/edit/${monthlyPayment.monthlyPayment_id}`, {
      state: {
        fromCustomerCard: isCustomerCard,
        customerId: monthlyPayment.customer_id
      }
    })
  }

  const columns = [
    !isCustomerCard && { label: t('customerName'), key: 'customer_name' },
    { label: t('dates'), key: 'dates' },
    { label: t('sum'), key: 'amount' },
    { label: t('total'), key: 'total_amount' },
    { label: t('belongsToAnOrganization'), key: 'belongsOrganization' },
    { label: t('lastAttempt'), key: 'last_attempt' },
    { label: t('lastSuccess'), key: 'last_sucsse' },
    { label: t('nextCharge'), key: 'next_charge' },
    { label: t('update'), key: 'update_at' },
    isCustomerCard && { label: '', key: 'updateMonthlyPayment' },
  ].filter(Boolean) as { label: string, key: string }[]

  // תיקון: filteredPayments מוגדר כ־monthlyPayment (או תוסיף לוגיקת סינון אם צריך)
  const filteredPayments: MonthlyPayment.Model[] = monthlyPayment

  const tableData = filteredPayments.map((payment: MonthlyPayment.Model) => ({
    monthlyPayment_id: payment.monthlyPayment_id,
    customer_name: (
      <Link
        to={`/customer/card/${payment.customer_id}`}
        style={{
          color: colors.c8,
          cursor: 'pointer',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {customerData[payment.customer_id]?.name || t('loading')}
      </Link>
    ),
    dates: `${formatDateToString(payment.start_date)} - ${formatDateToString(payment.end_date)}`,
    amount: payment.amount,
    total_amount: payment.total_amount,
    belongsOrganization: payment.belongsOrganization,
    last_attempt: `${formatDateToString(payment.last_attempt)}`,
    last_sucsse: `${formatDateToString(payment.last_sucsse)}`,
    next_charge: `${formatDateToString(payment.next_charge)}`,
    update_at: `${formatDateToString(payment.update_at)}`,
    updateMonthlyPayment: (
      <PencilIcon
        style={{ width: '24px', height: '24px', color: colors.c2, cursor: 'pointer' }}
        onClick={() => onClickMonthlyPayment(payment)}
      />
    ),
  }))

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 4,
          direction: 'rtl'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 3,
          }}
        >
          {!isCustomerCard ? <CustomTable
            columns={columns}
            data={tableData}
            onRowClick={onClickMonthlyPayment}
            showSummary={{
              page,
              limit,
              total,
              totalPages,
              onPageChange: onPageChange || (() => { })
            }}
          /> :
            <CustomTable
              columns={columns}
              data={tableData}
            />
          }
        </Box>
      </Box>
    </>
  )
}

export default MonthlyPaymentList
