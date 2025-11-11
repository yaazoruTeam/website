import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDeviceById, deleteDevice } from '../../api/device'
import { getCustomerDeviceByDeviceId } from '../../api/customerDevice'
import { Device, CustomerDevice } from '@model'
import DeviceCardContent from './DeviceCardContent'
import { AxiosError } from 'axios'
import { CustomButton } from '../designComponent/Button'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useMediaQuery } from '@mui/system'

const DeviceCard: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [device, setDevice] = useState<Device.Model | null>(null)
  const [customerDevice, setCustomerDevice] = useState<CustomerDevice.Model | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletionError, setDeletionError] = useState<string | null>(null)

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
        
      } catch (err: AxiosError | unknown) {
        // if (err instanceof AxiosError && err.response?.status === 409) {
        setError(err instanceof AxiosError && err.response?.data || 'Failed to fetch device data')
        alert(`Error fetching device: ${err instanceof AxiosError ? err.response?.data : err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDeviceData()
  }, [id])

  const deletingDevice = async () => {
    setDeleting(true)
    setDeletionError(null)
    
    try {
      console.log('delete device: ', device?.device_id)
      if (device && device.device_id) {
        await deleteDevice(device.device_id)
        setOpenModal(false)
        navigate('/devices')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete device'
      setDeletionError(errorMessage)
      console.error('Error deleting device:', err)
    } finally {
      setDeleting(false)
    }
  }

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
        {/* Header Section with Delete Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            marginBottom: '20px',
            paddingRight: '20px',
          }}
        >
          <CustomButton
            label={t('deletingDevice')}
            size={isMobile ? 'small' : 'large'}
            state='default'
            buttonType='third'
            icon={<TrashIcon />}
            onClick={() => setOpenModal(true)}
            disabled={device?.status !== 'active'}
          />
        </Box>

        {/* Device Content */}
        <DeviceCardContent 
          device={device} 
          customerDevice={customerDevice || undefined} 
        />
      </Box>

      {/* Delete Confirmation Modal */}
      <CustomModal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            direction: 'rtl',
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <CustomTypography
            text={t('deletingDevice')}
            variant='h1'
            weight='medium'
            color={colors.blue900}
          />
          <CustomTypography
            text={t('deviceDeletionWarning')}
            variant='h3'
            weight='medium'
            color={colors.blue900}
          />
          
          {deletionError && (
            <Box sx={{ padding: 2, backgroundColor: colors.red100, borderRadius: "8px", width: '100%' }}>
              <CustomTypography
                text={deletionError}
                variant="h4"
                weight="regular"
                color={colors.red500}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            gap: 2,
            width: '100%',
          }}
        >
          <CustomButton
            label={t('approval')}
            size={isMobile ? 'small' : 'large'}
            buttonType='first'
            state='default'
            onClick={deletingDevice}
            disabled={deleting}
          />
          <CustomButton
            label={t('cancellation')}
            size={isMobile ? 'small' : 'large'}
            buttonType='second'
            state='hover'
            onClick={() => setOpenModal(false)}
            disabled={deleting}
          />
        </Box>
      </CustomModal>
    </>
  )
}

export default DeviceCard
