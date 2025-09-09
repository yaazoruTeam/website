import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import { getDeviceById } from '../../api/device'
import { getCustomerDeviceByDeviceId } from '../../api/customerDevice'
import { Device, CustomerDevice, EntityType } from '@model'
import DeviceCardContent from './DeviceCardContent'
import ArrowToChatComments from '../designComponent/ArrowToChatComments'
import ChatBot from '../ChatBot/ChatBot'

const DeviceCard: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [device, setDevice] = useState<Device.Model | null>(null)
  const [customerDevice, setCustomerDevice] = useState<CustomerDevice.Model | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

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
        
      } catch (err: any) {
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
    <>
      <Box>
         {/* רכיב החץ לצ'אט */}
          <Box sx={{ width: '60px', height: '60px' }}>
            <ArrowToChatComments onClick={() => setIsChatOpen(true)} />
          </Box>

        {/* תוכן המכשיר */}
        <DeviceCardContent 
          device={device} 
          customerDevice={customerDevice || undefined} 
        />
      </Box>

      {/* Chat Modal */}
      {isChatOpen && (
        <Box
         sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // רקע כהה יותר
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'start', // מרכז המסך
            alignItems: 'center', // מרכז המסך אנכית
            padding: '20px', // רווח מהקצוות
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false)
            }
          }}
        >
          <Box
            sx={{
              marginTop: 38,
              marginRight: -3,
              backgroundColor: 'white',
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6, // פינות מעוגלות
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', // צל
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChatBot
              entityType={EntityType.Device}
              entityId={String(device.device_id)}
              onClose={() => setIsChatOpen(false)}
            />
          </Box>
        </Box>
      )}
    </>
  )
}

export default DeviceCard
