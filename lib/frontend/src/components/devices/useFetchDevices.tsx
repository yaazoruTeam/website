import { useState, useEffect } from 'react'
import { getSimCardsWithDevices } from '../../api/simCard'
import { SimCard } from '@model'

interface UseFetchDevicesProps {
  page: number
  filterType?:
  | { type: "date"; value: { start: Date; end: Date } }
  | { type: "status"; value: "active" | "inactive" }
}

interface UseFetchDevicesReturn {
  devices: (SimCard.Model)[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const useFetchDevices = ({ page, filterType }: UseFetchDevicesProps): UseFetchDevicesReturn => {
  const [devices, setDevices] = useState<SimCard.Model[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1)
  }

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get SIM cards with joined devices instead of devices directly
        const response = await getSimCardsWithDevices(page)

        // Use SIM cards directly - they already include device and customer data
        let devices: SimCard.Model[] = response.data

        // Apply client-side filtering for now
        // TODO: Move this to server-side filtering
        if (filterType) {
          switch (filterType.type) {
            case 'date':
              // TODO: Add date filtering logic when device creation date is available
              // For now, we'll filter all results when date filter is applied
              devices = devices.filter(() => {
                // Add date logic here when created_at or similar field is available
                return true // Placeholder
              })
              break
            case 'status':
              devices = devices.filter((item: any) => {
                // For Device objects, check status property
                if ('status' in item) {
                  return item.status === filterType.value
                }
                // For SimCard objects without device, include them
                return true
              })
              break
          }
        }

        setDevices(devices)
        setTotal(filterType ? devices.length : response.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch devices')
        setDevices([])
        setTotal(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [page, filterType, refetchTrigger])

  return { devices, total, isLoading, error, refetch }
}
