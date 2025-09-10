import React, { useState } from 'react'
import DevicesList from './devicesList'
import { useFetchDevices } from './useFetchDevices'

const Devices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<
    | { type: "date"; value: { start: Date; end: Date } }
    | { type: "status"; value: "active" | "inactive" }
    | null
  >(null);
  const limit = import.meta.env.VITE_LIMIT ? parseInt(import.meta.env.VITE_LIMIT) : 10

  const { devices, total, isLoading, error, refetch } = useFetchDevices({ page, filterType: filterType ?? undefined })

  if (isLoading) return <div>Loading devices...</div>
  if (error) return <div>{error}</div>

  return (
    <>
      <DevicesList
          devices={devices}
          total={total}
          page={page} 
          limit={limit}
          onPageChange={setPage}
          onFilterChange={setFilterType}
          onRefresh={refetch}
      />
    </>
  )
}

export default Devices
