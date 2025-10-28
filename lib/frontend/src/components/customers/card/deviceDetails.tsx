import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { getAllCustomerDevicesByCustomerId, getCustomerDeviceByDeviceId, createCustomerDevice } from '../../../api/customerDevice'
import { Customer, CustomerDevice, Device } from '@model'
import CustomTypography from '../../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { colors } from '../../../styles/theme'
import { getDeviceById, getDevices } from '../../../api/device'
import DeviceRowInline from './DeviceRowInline'
import { Autocomplete, TextField, CircularProgress } from '@mui/material'
import { CustomButton } from '../../designComponent/Button'

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
  const { t } = useTranslation()
 const [devices, setDevices] = useState<
    (Device.Model & { customerDevice: CustomerDevice.Model })[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [openedDeviceId, setOpenedDeviceId] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<Device.Model | null>(null) // המכשיר שנבחר לשיוך
  const [availableDevices, setAvailableDevices] = useState<Device.Model[]>([]) // רשימת המכשירים הפנויים
  const [isLoadingAvailableDevices, setIsLoadingAvailableDevices] = useState<boolean>(false) // מצב טעינת המכשירים הפנויים
  const [assignmentError, setAssignmentError] = useState<string | null>(null) // הודעת שגיאה בשיוך
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null) // הודעת הצלחה בשיוך
  const [Assigning, setAssigning] = useState<boolean>(false) // האם מתבצע שיוך כרגע

  const fetchDevicesByCustomerId = useCallback(
    async (customerId: string) => {
      try {
        setIsLoading(true)
        setError(null)

        const customerDevicesResponse = await getAllCustomerDevicesByCustomerId(customerId, 1)

        if (!customerDevicesResponse.data || customerDevicesResponse.data.length === 0) {
          setDevices([])
          setIsLoading(false)
          return
        }

        const devicesData = await Promise.all(
          customerDevicesResponse.data.map(async (customerDevice: CustomerDevice.Model) => {
            try {
              const device = await getDeviceById(customerDevice.device_id)
              return { ...device, customerDevice }
            } catch (error: unknown) {
              return null
            }
          }),
        )
        const filteredDevices = devicesData.filter(
          (d: Device.Model | null | undefined): d is Device.Model & { customerDevice: CustomerDevice.Model } =>
            d !== null && d !== undefined,
        )
        setDevices(filteredDevices)
      } catch (error: unknown) {
        setDevices([])
      } finally {
        setIsLoading(false)
      }
    },
    [t], 
  )

  const fetchAvailableDevices = useCallback(async () => {
    try {
      setIsLoadingAvailableDevices(true)
      
      let allDevices: Device.Model[] = []
      let currentPage = 1
      let hasMorePages = true
      
      while (hasMorePages) {
        const pageResponse = await getDevices(currentPage)
        
        if (pageResponse.data && pageResponse.data.length > 0) {
          allDevices = [...allDevices, ...pageResponse.data]
          hasMorePages = currentPage < pageResponse.totalPages
          currentPage++
        } else {
          hasMorePages = false
        }
      }
      
      if (allDevices.length === 0) {
        setAvailableDevices([])
        return
      }

      const availableList: Device.Model[] = []
      
      for (const device of allDevices) {
        try {
          const customerDevice = await getCustomerDeviceByDeviceId(device.device_id)
          if (!customerDevice) {
            availableList.push(device)
          }
        } catch (error: unknown) {
          availableList.push(device)
        }
      }
      
      setAvailableDevices(availableList)
    } catch (error: unknown) {
      setAvailableDevices([])
    } finally {
      setIsLoadingAvailableDevices(false)
    }
  }, [])


  useEffect(() => {
    // שליפת המכשירים של הלקוח
    fetchDevicesByCustomerId(customer.customer_id)
    fetchAvailableDevices()
  }, [customer.customer_id, fetchDevicesByCustomerId, fetchAvailableDevices])

  const handleRowClick = (deviceId: string) => {
    setOpenedDeviceId((prev) => (prev === deviceId ? null : deviceId))
  }

  const handleAssignDevice = async () => {
    if (!selectedDevice) {
      setAssignmentError(t('pleaseSelectDevice'))
      return
    }

    try {
      setAssigning(true)
      setAssignmentError(null)
      setAssignmentSuccess(null)

      const existingAssignment = await getCustomerDeviceByDeviceId(selectedDevice.device_id)
      if (existingAssignment) {
        setAssignmentError(t('deviceAlreadyAssigned'))
        setAssigning(false)
        return
      }
      const today = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 5)

      const customerDeviceData: Omit<CustomerDevice.Model, 'customerDevice_id'> = {
        customer_id: String(customer.customer_id),
        device_id: String(selectedDevice.device_id),
        receivedAt: today,
        planEndDate: endDate,
      }
      
      await createCustomerDevice(customerDeviceData)
      
      setAssignmentSuccess(t('deviceAssignedSuccessfully'))
      setSelectedDevice(null)
      
      await fetchDevicesByCustomerId(customer.customer_id)
      await fetchAvailableDevices()
      
      setTimeout(() => {
        setAssignmentSuccess(null)
      }, 3000)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: any;
            status?: number;
            statusText?: string;
          };
          message?: string;
        }
        
        let errorMessage = t('errorAssigningDevice')
        
        if (axiosError.response?.data) {
          const responseData = axiosError.response.data
          
          if (typeof responseData === 'string') {
            errorMessage = responseData
          } else if (responseData.message) {
            errorMessage = responseData.message
          } else if (responseData.error) {
            errorMessage = responseData.error
          }
        }
        
        setAssignmentError(errorMessage)
      } else {
        setAssignmentError(t('errorAssigningDevice'))
      }
    } finally {
      setAssigning(false)
    }
  }

  return (
    <Box>
      <Box sx={{ marginBottom: '28px' }}>
        <CustomTypography text={t('devices')} variant='h1' weight='bold' color={colors.blue900} />
      </Box>
      {error && <CustomTypography text={error} variant='h4' weight='medium' color={colors.red500} />}
      {isLoading ? (
        <CustomTypography text={t('loading')} variant='h4' weight='medium' color={colors.blue900} />
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

      <Box sx={{ marginTop: '40px' }}>
        <Box sx={{ marginBottom: '28px' }}>
          <CustomTypography
            text={t('deviceAssignment')}
            variant='h1'
            weight='bold'
            color={colors.blue900}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column', 
          gap: '20px',
          padding: '10px', 
          backgroundColor: colors.neutral0, 
          borderRadius: '8px',
          direction: 'rtl',
        }}>
       
          <Box sx={{ 
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            direction: 'rtl',
          }}>
            <Box sx={{ width: '33%' }}> 
              <Autocomplete
                options={availableDevices}
                getOptionLabel={(option) => `${option.device_id}${option.model ? ` - ${option.model}` : ''}`} // תצוגת המכשיר
                value={selectedDevice} 
                onChange={(_event, newValue) => {
                  setSelectedDevice(newValue)
                  setAssignmentError(null) 
                  setAssignmentSuccess(null) 
                }}
                loading={isLoadingAvailableDevices} 
                disabled={Assigning}
                onOpen={() => {
                  fetchAvailableDevices()
                }}
                renderInput={(params) => (
                  <TextField
                    {...params} 
                    label={t('selectDevice')} 
                    placeholder={t('searchDevice')}
                    variant="outlined" 
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingAvailableDevices ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    InputLabelProps={{
                      sx: {
                        right: 45,
                        left: 'auto',
                        transformOrigin: 'top right',
                        '&.MuiInputLabel-shrink': {
                          transform: 'translate(30px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: colors.neutral0, 
                        borderRadius: '6px', 
                        paddingRight: '14px',
                        '& fieldset': {
                          borderColor: !selectedDevice ? colors.neutral300 : colors.blueOverlay700, // צבע המסגרת
                          textAlign: 'right', 
                        },
                        '&:hover fieldset': {
                          borderColor: !selectedDevice ? colors.neutral400 : colors.blue600,
                        },
                        '& input': {
                          textAlign: 'right', 
                          direction: 'rtl',
                          paddingRight: '0px',
                        },
                      },
                      '& .MuiInputLabel-outlined': {
                        textAlign: 'right',
                      },
                    }}
                  />
                )}
                noOptionsText={t('noAvailableDevices')}
                sx={{
                  '& .MuiAutocomplete-popper': {
                    direction: 'rtl',
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    left: '9px', 
                    right: 'auto', 
                  },
                }}
              />
            </Box>
            
            <CustomButton
              label={Assigning ? (t('assigning')) : (t('assignDevice'))} 
              size='small'
              state={!selectedDevice || Assigning ? 'active' : 'default'}
              buttonType='first'
              onClick={handleAssignDevice} 
              disabled={!selectedDevice || Assigning}
              sx={{
                minWidth: '100px',
                height: '40px',
                fontSize: '14px', 
                ...((!selectedDevice || Assigning) && {
                  borderColor: `${colors.neutral300} !important`,
                }),
              }}
            />
          </Box>
          
          {assignmentError && (
            <Box sx={{ 
              padding: '10px',
              backgroundColor: colors.red100,
              borderRadius: '6px',
              border: `1px solid ${colors.red500}`, 
              direction: 'rtl',
            }}>
              <CustomTypography 
                text={assignmentError} 
                variant='h4' 
                weight='medium' 
                color={colors.red500} 
              />
            </Box>
          )}
          
          {assignmentSuccess && (
            <Box sx={{ 
              padding: '10px',
              backgroundColor: colors.green100,
              borderRadius: '6px',
              border: `1px solid ${colors.green500}`,
              direction: 'rtl', 
            }}>
              <CustomTypography 
                text={assignmentSuccess} 
                variant='h4' 
                weight='medium' 
                color={colors.green500} 
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default DeviceDetails
