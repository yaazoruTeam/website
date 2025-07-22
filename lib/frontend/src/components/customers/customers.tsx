import React, { useState } from 'react'
import CustomersList from './customersList'
import { useFetchCustomers } from './useFetchCustomers'
import ChatBot from '../ChatBot/ChatBot'
import { EntityType } from '../../model/src'

const Customers: React.FC = () => {
  const [page, setPage] = useState(1)
  const [filterType, setFilterType] = useState<
    | { type: 'city'; value: string }
    | { type: 'date'; value: { start: Date; end: Date } }
    | { type: 'status'; value: 'active' | 'inactive' }
    | null
  >(null)
  const limit = Number(import.meta.env.REACT_APP_LIMIT) || 10

  const { customers, total, isLoading, error, noResults, noResultsType } = useFetchCustomers({
    page,
    filterType: filterType ?? undefined,
  })

  if (isLoading) return <div>Loading customers...</div>

  if (error) return <div>{error}</div>

  return (
    <>
      <CustomersList
        customers={customers}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onFilterChange={setFilterType}
        noResults={noResults}
        noResultsType={noResultsType}
      />
      <ChatBot entityType={EntityType.Customer} entityId='1'/>
    </>
  )
}

export default Customers
