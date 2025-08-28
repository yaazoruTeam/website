import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import { getDeviceById } from '../../api/device'
import { getCustomerDeviceByDeviceId } from '../../api/customerDevice'
import { Device, CustomerDevice } from '@model'
import DeviceCardContent from './DeviceCardContent'

const DeviceCard: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [device, setDevice] = useState<Device.Model | null>(null)
  const [customerDevice, setCustomerDevice] = useState<CustomerDevice.Model | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeviceData = async () => {
      if (!id) {
        setError('No device ID provided')
        return
      }

      setLoading(true)
      setError(null)

      try {
        // שליפת נתוני המכשיר
        const deviceData = await getDeviceById(id)
        setDevice(deviceData)

        // ניסיון לשלוף נתוני customerDevice
        const customerDeviceData = await getCustomerDeviceByDeviceId(id)
        setCustomerDevice(customerDeviceData)
        
      } catch (err: unknown) {
        setError(err.message || 'Failed to fetch device data')
        console.error('Error fetching device:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeviceData()
  }, [id])

  if (loading) {
    return <Box>Loading device data...</Box>
  }

  if (error) {
    return <Box>Error: {error}</Box>
  }

  if (!device) {
    return <Box>Device not found</Box>
  }

  return (
    <Box>
      {/* תוכן המכשיר */}
      <DeviceCardContent 
        device={device} 
        customerDevice={customerDevice || undefined} 
      />
    </Box>
  )
}

export default DeviceCard
