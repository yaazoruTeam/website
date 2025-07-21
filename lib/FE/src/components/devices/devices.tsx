import React, { useState } from 'react'
import DevicesList from './devicesList'
import { useFetchDevices } from './useFetchDevices'
import ChatBot from '../ChatBot/ChatBot'

const Devices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<
    | { type: "date"; value: { start: Date; end: Date } }
    | { type: "status"; value: "active" | "inactive" }
    | null
  >(null);
  const limit = Number(import.meta.env.REACT_APP_LIMIT) || 10;

  const { devices, total, isLoading, error } = useFetchDevices({ page, filterType: filterType ?? undefined })

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
          onFilterChange={setFilterType} />
      <ChatBot />
    </>
  )
}

export default Devices
