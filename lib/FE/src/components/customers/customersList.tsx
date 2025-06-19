import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import AddCustomer from './AddCustomer'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Customer } from '../../model/src'
import CustomTable from '../designComponent/CustomTable'
import StatusTag from '../designComponent/Status'
import { useNavigate } from 'react-router-dom'
import { formatDateToString } from '../designComponent/FormatDate'
import CustomSearchSelect from './CustomSearchSelect'
import FilterResetButton from '../designComponent/FilterResetButton'
interface CustomersListProps {
  customers: Customer.Model[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onFilterChange: (filter: any) => void
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, total, page, limit, onPageChange, onFilterChange }) => {
  const totalPages = Math.ceil(total / limit)
  const { t } = useTranslation()
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const isMobile = useMediaQuery('(max-width:600px)')
  const navigate = useNavigate()
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleResetFilters = () => {
    // setFilteredCustomers(customers)
    // setDateRange(null)
    onFilterChange(null)
    onPageChange(1)
    setResetTrigger(true)
    setTimeout(() => setResetTrigger(false), 0)
  }

  const columns = [
    { label: t('customerName'), key: 'customer_name' },
    { label: t('registrationDate'), key: 'registration_date' },
    { label: t('city'), key: 'city' },
    { label: '', key: 'status' },
  ]

  const tableData = customers.map((customer) => ({
    customer_id: customer.customer_id,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    registration_date: `${formatDateToString(customer.created_at)}`,
    city: customer.city,
    status:
      customer.status === 'active' ? (
        <StatusTag status='active' />
      ) : (
        <StatusTag status='inactive' />
      ),
  }))

  const onClickCustomer = (customer: any) => {
    console.log(customer.customer_id)
    navigate(`/customer/card/${customer.customer_id}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '50%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      {showAddCustomer ? (
        <AddCustomer />
      ) : (
        <>
          <Box
            sx={{
              direction: 'rtl',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CustomTypography
              text={t('customerManagement')}
              variant='h1'
              weight='bold'
              color={colors.c11}
            />
            <CustomButton
              label={t('addingNewCustomer')}
              size={isMobile ? 'small' : 'large'}
              state='default'
              buttonType='first'
              onClick={() => setShowAddCustomer(true)}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              direction: 'rtl',
              marginTop: 2,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType='city'
                placeholder={t('CustomerCity')}
                onCitySelect={(city: string) => {
                  onFilterChange(city ? { type: 'city', value: city } : null)
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType='date'
                placeholder={t('DateInRange')}
                onDateRangeSelect={(start: Date, end: Date) => {
                  onFilterChange({ type: 'date', value: { start, end } })
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType='status'
                placeholder={t('customerStatus')}
                onStatusSelect={(status: 'active' | 'inactive') => {
                  onFilterChange(status ? { type: 'status', value: status } : null)
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
              <FilterResetButton onReset={handleResetFilters} />
            </Box>
          </Box>
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
            <CustomTable
              columns={columns}
              data={tableData}
              onRowClick={onClickCustomer}
              showSummary={{
                total,
                page,
                totalPages,
                limit,
                onPageChange,
              }}
              alignLastColumnLeft={true}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default CustomersList
