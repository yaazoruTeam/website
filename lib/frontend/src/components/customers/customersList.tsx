import React, { useState } from 'react'
import { useMediaQuery } from '@mui/material'
import AddCustomer from './AddCustomer'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Customer } from '@model'
import CustomTable, { TableRowData } from '../designComponent/CustomTable'
import { MessageType } from '../designComponent/NoDataMessage'
import StatusTag from '../designComponent/Status'
import { useNavigate } from 'react-router-dom'
import { formatDateToString } from '../designComponent/FormatDate'
import CustomSearchSelect from '../designComponent/CustomSearchSelect'
import FilterResetButton from '../designComponent/FilterResetButton'
import {
  CustomersListContainer,
  CustomersListHeader,
  CustomersListFilters,
  CustomersListFilterBox,
  CustomersListTable,
} from '../designComponent/styles/customersStyles'
import NoResultsMessage from '../designComponent/NoResultsMessage'

type FilterType = 
  | { type: 'city'; value: string }
  | { type: 'status'; value: 'active' | 'inactive' }
  | { type: 'date'; value: { start: Date; end: Date } }
  | { type: 'search'; value: string }

type CustomerTableRow = {
  customer_id: string
  customer_name: string
  registration_date: string
  city: string
  status: React.ReactNode
}

interface CustomersListProps {
  customers: Customer.Model[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onFilterChange: (filter: FilterType | null) => void
  noResults?: boolean
  noResultsType?: MessageType
  isResetDisabled: boolean 
}

const CustomersList: React.FC<CustomersListProps> = ({
  customers,
  total,
  page,
  limit,
  onPageChange,
  onFilterChange,
  noResults = false,
  noResultsType = 'general',
  isResetDisabled,
}) => {
  const totalPages = Math.ceil(total / limit)
  const { t } = useTranslation()
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const isMobile = useMediaQuery('(max-width:600px)')
  const navigate = useNavigate()
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleResetFilters = () => {
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

  const tableData: CustomerTableRow[] = customers.map((customer) => ({
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClickCustomer = (rowData: TableRowData, _rowIndex: number) => {
    console.log(rowData.customer_id)
    navigate(`/customer/card/${rowData.customer_id}`)
  }

  return (
    <CustomersListContainer>
      {showAddCustomer ? (
        <AddCustomer />
      ) : (
        <>
          <CustomersListHeader>
            <CustomTypography
              text={t('customerManagement')}
              variant='h1'
              weight='bold'
              color={colors.blue900}
            />
            <CustomButton
              label={t('addingNewCustomer')}
              size={isMobile ? 'small' : 'large'}
              state='default'
              buttonType='first'
              onClick={() => setShowAddCustomer(true)}
            />
          </CustomersListHeader>

          <CustomersListFilters>
            <CustomersListFilterBox>
              <CustomSearchSelect
                searchType='city'
                placeholder={t('CustomerCity')}
                onCitySelect={(city: string) => {
                  onFilterChange(city ? { type: 'city', value: city } : null)
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </CustomersListFilterBox>
            <CustomersListFilterBox>
              <CustomSearchSelect
                searchType='date'
                placeholder={t('DateInRange')}
                onDateRangeSelect={(start: Date, end: Date) => {
                  onFilterChange({ type: 'date', value: { start, end } })
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </CustomersListFilterBox>
            <CustomersListFilterBox>
              <CustomSearchSelect
                searchType='status'
                placeholder={t('customerStatus')}
                onStatusSelect={(status: 'active' | 'inactive') => {
                  onFilterChange(status ? { type: 'status', value: status } : null)
                  onPageChange(1)
                }}
                resetTrigger={resetTrigger}
              />
            </CustomersListFilterBox>
            <CustomersListFilterBox>
              <FilterResetButton onReset={handleResetFilters} disabled={isResetDisabled} />
            </CustomersListFilterBox>
          </CustomersListFilters>

          <CustomersListTable>
            {noResults ? (
              <NoResultsMessage
                messageType={noResultsType as 'date' | 'status' | 'general'}
              />
            ) : (
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
            )}
          </CustomersListTable>
        </>
      )}
    </CustomersListContainer>
  )
}

export default CustomersList
