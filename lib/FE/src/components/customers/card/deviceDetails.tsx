import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { getAllCustomerDevicesByCustomerId } from '../../../api/customerDevice'
import { Customer, CustomerDevice, Device } from '../../../model'
import CustomTypography from '../../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { colors } from '../../../styles/theme'
import { getDeviceById } from '../../../api/device'
import DeviceCardContent from '../../devices/DeviceCardContent'
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
  const { t } = useTranslation()
  const [devices, setDevices] = useState<
    (Device.Model & { customerDevice: CustomerDevice.Model })[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [openedDeviceId, setOpenedDeviceId] = useState<string | null>(null)

  const fetchDevicesByCustomerId = useCallback(
    async (customerId: string) => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getAllCustomerDevicesByCustomerId(customerId, 1) // page 1

        if (response.data.length === 0) {
          setDevices([])
          setError(t('noDevicesFound'))
          return
        }

        const devicesData = await Promise.all(
          response.data.map(async (customerDevice: CustomerDevice.Model) => {
            try {
              const device = await getDeviceById(customerDevice.device_id)
              return { ...device, customerDevice }
            } catch (error: any) {
              console.error('Error fetching device details:', error)
              return null
            }
          }),
        )

        const filteredDevices = devicesData.filter(
          (d: any): d is Device.Model & { customerDevice: CustomerDevice.Model } =>
            d !== null && d !== undefined,
        )

        setDevices(filteredDevices)
      } catch (error: any) {
        console.error('Error fetching devices:', error)
        if (error.response && error.response.status === 404) {
          setError(t('noDevicesFound'))
        } else {
          setError(t('errorFetchingDevices'))
        }
      } finally {
        setIsLoading(false)
      }
    },
    [t],
  )

  useEffect(() => {
    fetchDevicesByCustomerId(customer.customer_id)
  }, [customer.customer_id, fetchDevicesByCustomerId])

  const handleRowClick = (deviceId: string) => {
    setOpenedDeviceId((prev) => (prev === deviceId ? null : deviceId))
  }

  // קומפוננט להצגת פרטי מכשיר בתוך הדף
  const DeviceRowInline: React.FC<{
    device: Device.Model & { customerDevice: CustomerDevice.Model }
    isOpen: boolean
    onClick: () => void
  }> = ({ device, isOpen, onClick }) => {
    return (
      <Box
        sx={{
          border: `1px solid ${colors.c15}`,
          borderRadius: '8px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}
      >
        {/* כותרת המכשיר - לחיצה */}
        <Box
          onClick={onClick}
          sx={{
            padding: '16px',
            backgroundColor: colors.c6,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: colors.c15
            }
          }}
        >
          <Box>
            <CustomTypography
              text={device.device_number}
              variant='h1'
              weight='medium'
              color={colors.c8}
            />
          </Box>
          {isOpen ? (
            <ChevronDownIcon
              style={{
                width: '24px',
                height: '24px',
                color: colors.c11
              }}
            />
          ) : (
            <ChevronLeftIcon
              style={{
                width: '24px',
                height: '24px',
                color: colors.c11
              }}
            />
          )}
        </Box>

        {/* תוכן המכשיר - נפתח בלחיצה */}
        {isOpen && (
          <Box sx={{ padding: '16px' }}>
            <DeviceCardContent device={device} customerDevice={device.customerDevice} />
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ marginBottom: '28px' }}>
        <CustomTypography text={t('devices')} variant='h1' weight='bold' color={colors.c11} />
      </Box>
      {error && <CustomTypography text={error} variant='h4' weight='medium' color={colors.c28} />}
      {isLoading ? (
        <CustomTypography text={t('loading')} variant='h4' weight='medium' color={colors.c11} />
      ) : (
        <Box>
          {devices.map((device) => (
            <DeviceRowInline
              key={device.device_id}
              device={device}
              isOpen={openedDeviceId === device.device_id}
              onClick={() => handleRowClick(device.device_id)}
            />
          ))}
        </Box>
      )}

      <Box sx={{ my: '80px' }}>
        <Box sx={{ marginBottom: '20px' }}>
          <CustomTypography text={t('activeLoans')} variant='h1' weight='bold' color={colors.c11} />
        </Box>
      </Box>
      <Box>
        <Box sx={{ marginBottom: '28px' }}>
          <CustomTypography
            text={t('deviceAssignment')}
            variant='h1'
            weight='bold'
            color={colors.c11}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default DeviceDetails
