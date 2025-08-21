import { useState, useEffect } from 'react'
import {
  getCustomers,
  getCustomersByCity,
  getCustomersByStatus,
  getCustomersByDateRange,
  getCustomersByName,
} from '../../api/customerApi'
import { Customer } from '@model'

interface FilterValue {
  city?: string
  status?: 'active' | 'inactive'
  dateRange?: { start: Date; end: Date }
  search?: string
}

interface UseFetchCustomersProps {
  page: number
  filterType?: {
    type: 'city' | 'status' | 'date' | 'search'
    value: FilterValue[keyof FilterValue]
  }
}

export const useFetchCustomers = ({ page, filterType }: UseFetchCustomersProps) => {
  const [customers, setCustomers] = useState<Customer.Model[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)
  const [noResultsType, setNoResultsType] = useState<string>('general')

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true)
      try {
        let data, total
        if (!filterType) {
          const res = await getCustomers(page)
          data = res.data
          total = res.total
        } else if (filterType.type === 'city' && typeof filterType.value === 'string') {
          const res = await getCustomersByCity(filterType.value, page)
          data = res.data
          total = res.total
        } else if (filterType.type === 'status' && (filterType.value === 'active' || filterType.value === 'inactive')) {
          const res = await getCustomersByStatus(filterType.value, page)
          data = res.data
          total = res.total
        } else if (filterType.type === 'date' && filterType.value && typeof filterType.value === 'object' && 'start' in filterType.value && 'end' in filterType.value) {
          const res = await getCustomersByDateRange(
            filterType.value.start,
            filterType.value.end,
            page,
          )
          data = res.data
          total = res.total
        } else if (filterType.type === 'search' && typeof filterType.value === 'string') {
          const res = await getCustomersByName(filterType.value, page)
          data = res.data
          total = res.total
        }
        setCustomers(data ?? [])
        setTotal(total ?? 0)
        setError(null) // Clear any previous errors
        setNoResults(false) // Clear no results flag when we have data
        setNoResultsType('general') // Reset type
      } catch (error: any) {
        console.error('Error fetching customers:', error)

        // Handle 404 as "no results found" rather than an error
        if (error.response?.status === 404 || error.message?.includes('404')) {
          setCustomers([])
          setTotal(0)
          setError(null) // Clear error for 404 - this is just "no results"
          setNoResults(true) // Set no results flag

          // TODO: Temporary code waiting for site specification
          // These lines are temporary and waiting for final website requirements

          // Set specific message type based on filter
          if (filterType?.type === 'date') {
            setNoResultsType('date')
          } else if (filterType?.type === 'city') {
            setNoResultsType('city')
          } else if (filterType?.type === 'status') {
            setNoResultsType('status')
          } else {
            setNoResultsType('general')
          }
        } else {
          // Real errors (network, 500, etc.)
          setError(`Failed to fetch customers: ${error.message}`)
          setCustomers([])
          setTotal(0)
          setNoResults(false)
          setNoResultsType('general')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [page, filterType])

  return { customers, total, isLoading, error, noResults, noResultsType }
}
