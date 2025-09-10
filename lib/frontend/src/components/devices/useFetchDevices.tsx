import { useState, useEffect } from 'react'
import { getDevices } from '../../api/device'
import { Device } from '@model'

interface UseFetchDevicesProps {
  page: number
  filterType?: 
    | { type: "date"; value: { start: Date; end: Date } }
    | { type: "status"; value: "active" | "inactive" }
}

interface UseFetchDevicesReturn {
  devices: Device.Model[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const useFetchDevices = ({ page, filterType }: UseFetchDevicesProps): UseFetchDevicesReturn => {
  const [devices, setDevices] = useState<Device.Model[]>([])
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
        // TODO: Update getDevices API to support filters
        const response = await getDevices(page)
        
        let filteredDevices = response.data

        // Apply client-side filtering for now
        // TODO: Move this to server-side filtering
        if (filterType) {
          switch (filterType.type) {
            case 'date':
              // TODO: Add date filtering logic when device creation date is available
              // For now, we'll filter all results when date filter is applied
              filteredDevices = response.data.filter(() => {
                // Add date logic here when created_at or similar field is available
                return true // Placeholder
              })
              break
            case 'status':
              filteredDevices = response.data.filter(device => 
                device.status === filterType.value
              )
              break
          }
        }

        setDevices(filteredDevices)
        setTotal(filterType ? filteredDevices.length : response.total)
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
