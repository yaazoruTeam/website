import React, { useState } from 'react'
import CustomersList from './customersList'
import { useFetchCustomers } from './useFetchCustomers'

type FilterType = 
  | { type: 'city'; value: string }
  | { type: 'status'; value: 'active' | 'inactive' }
  | { type: 'date'; value: { start: Date; end: Date } }
  | { type: 'search'; value: string }

const Customers: React.FC = () => {
  const [page, setPage] = useState(1)
  const [filterType, setFilterType] = useState<FilterType | null>(null)
  const limit = import.meta.env.VITE_LIMIT ? parseInt(import.meta.env.VITE_LIMIT) : 10

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
    </>
  )
}

export default Customers
