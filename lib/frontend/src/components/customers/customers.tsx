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

  const { customers, total, isLoading, error } = useFetchCustomers({
    page,
    filterType: filterType ?? undefined,
  })
  const disabled = filterType === null; // אם אין פילטר, הכפתור יהיה מושבת
  // קביעת סוג ההודעה בהתבסס על הפילטר הפעיל
  const getNoResultsType = (): 'date' | 'status' | 'search' | 'city' | 'filter' | 'general' => {
    if (!filterType) return 'general'
    
    switch (filterType.type) {
      case 'date':
        return 'date'
      case 'status':
        return 'status'
      case 'search':
        return 'search'
      case 'city':
        return 'city'
      default:
        return 'general'
    }
  }

  // בדיקה האם יש פילטר פעיל אבל אין תוצאות
  const hasNoResults = filterType !== null && customers.length === 0 && !isLoading

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
        noResults={hasNoResults}
        noResultsType={getNoResultsType()}
        isResetDisabled={disabled}
      />
    </>
  )
}

export default Customers
