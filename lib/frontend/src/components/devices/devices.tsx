import React, { useState } from 'react'
import DevicesList from './devicesList'
import { useFetchDevices } from './useFetchDevices'
import ChatBot from '../ChatBot/ChatBot'
import { EntityType } from '@model'
import WidelyDetails from './widelyDetails'

const Devices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<
    | { type: "date"; value: { start: Date; end: Date } }
    | { type: "status"; value: "active" | "inactive" }
    | null
  >(null);
  const limit = import.meta.env.VITE_LIMIT ? parseInt(import.meta.env.VITE_LIMIT) : 10

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
      <ChatBot entityType={EntityType.Device} entityId='1' />
      <WidelyDetails simNumber='8997212330000331203' />

    </>
  )
}

export default Devices
