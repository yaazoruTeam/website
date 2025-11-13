import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { getSimCardsByCustomerId, getSimCardsWithoutCustomerButWithDevice, updateSimCard } from '../../../api/simCard'
import { Customer, SimCard } from '@model'
import CustomTypography from '../../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { colors } from '../../../styles/theme'
import DeviceRowInline from './DeviceRowInline'
import { Autocomplete, TextField, CircularProgress } from '@mui/material'
import { CustomButton } from '../../designComponent/Button'

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
  const { t } = useTranslation()
  const [devices, setDevices] = useState<SimCard.Model[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [openedDeviceId, setOpenedDeviceId] = useState<string | null>(null)
  const [selectedSimCard, setSelectedSimCard] = useState<SimCard.Model | null>(null)
  const [availableSimCards, setAvailableSimCards] = useState<SimCard.Model[]>([])
  const [isLoadingAvailableDevices, setIsLoadingAvailableDevices] = useState<boolean>(false)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null)
  const [Assigning, setAssigning] = useState<boolean>(false)

  // Fetch SIM cards for this customer
  const fetchSimCardsByCustomerId = useCallback(
    async (customerId: number) => {
      try {
        setIsLoading(true)
        setError(null)

        const simCardsResponse = await getSimCardsByCustomerId(customerId, 1)

        if (!simCardsResponse.data || simCardsResponse.data.length === 0) {
          setDevices([])
          setIsLoading(false)
          return
        }

        setDevices(simCardsResponse.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch SIM cards')
        setDevices([])
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Fetch available SIM cards without customer but with device
  const fetchAvailableDevices = useCallback(async () => {
    try {
      setIsLoadingAvailableDevices(true)
      
      let allSimCards: SimCard.Model[] = []
      let currentPage = 1
      let hasMorePages = true
      
      // Fetch all pages of SIM cards without customer but with device
      while (hasMorePages) {
        const pageResponse = await getSimCardsWithoutCustomerButWithDevice(currentPage)
        
        if (pageResponse.data && pageResponse.data.length > 0) {
          allSimCards = [...allSimCards, ...pageResponse.data]
          hasMorePages = currentPage < pageResponse.totalPages
          currentPage++
        } else {
          hasMorePages = false
        }
      }
      
      if (allSimCards.length === 0) {
        setAvailableSimCards([])
        return
      }
      
      setAvailableSimCards(allSimCards)
    } catch (err) {
      console.error('Error fetching available devices:', err)
      setAvailableSimCards([])
    } finally {
      setIsLoadingAvailableDevices(false)
    }
  }, [])

  useEffect(() => {
    fetchSimCardsByCustomerId(customer.customer_id)
    fetchAvailableDevices()
  }, [customer.customer_id, fetchSimCardsByCustomerId, fetchAvailableDevices])

  const handleRowClick = (deviceId: string) => {
    setOpenedDeviceId((prev) => (prev === deviceId ? null : deviceId))
  }

  const handleAssignDevice = async () => {
    if (!selectedSimCard) {
      setAssignmentError(t('pleaseSelectDevice'))
      return
    }

    try {
      setAssigning(true)
      setAssignmentError(null)
      setAssignmentSuccess(null)

      if (!selectedSimCard.simCard_id) {
        setAssignmentError(t('pleaseSelectDevice'))
        setAssigning(false)
        return
      }

      // 1️⃣ קריאת שרת לעדכון ה-SIM card עם customer_id ו-receivedAt
      // זה העדכון הכי חשוב - אנחנו קושרים את ה-SIM card ללקוח
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 5)
console.log('--------------------------------------------');
console.log(selectedSimCard);
console.log(customer.customer_id);
console.log(futureDate);




      await updateSimCard(selectedSimCard.simCard_id, {
        ...selectedSimCard,
        customer_id: customer.customer_id,
        receivedAt: new Date(),
        planEndDate: futureDate,
      })

      // 2️⃣ אם ההעדכון הצליח, אנחנו מראים הודעת הצלחה
      setAssignmentSuccess(t('deviceAssignedSuccessfully'))
      setSelectedSimCard(null)
      
      // 3️⃣ רענון הנתונים - שליפה מחדש של:
      // - ה-SIM cards של הלקוח הזה (כדי להציג את ה-SIM card החדש שהוקצה)
      // - ה-SIM cards הזמינים (כדי להסיר את זה שהוקצה מהרשימה)
      await fetchSimCardsByCustomerId(customer.customer_id)
      await fetchAvailableDevices()
      
      // 4️⃣ הסרת הודעת ההצלחה אחרי 3 שניות
      setTimeout(() => {
        setAssignmentSuccess(null)
      }, 3000)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: unknown;
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
          } else if (responseData && typeof responseData === 'object' && 'message' in responseData) {
            errorMessage = (responseData as { message: string }).message
          } else if (responseData && typeof responseData === 'object' && 'error' in responseData) {
            errorMessage = (responseData as { error: string }).error
          }
        }
        
        setAssignmentError(errorMessage)
      } else if (error instanceof Error) {
        setAssignmentError(error.message)
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
              simCard={device}
              isOpen={openedDeviceId === device.device_id?.toString()}
              onClick={() => device.device_id !== undefined && handleRowClick(device.device_id.toString())}
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
                options={availableSimCards}
                getOptionLabel={(option) => `${option.simNumber}${option.device?.device_number ? ` - ${option.device.device_number}` : ''}`}
                value={selectedSimCard} 
                onChange={(_event, newValue) => {
                  setSelectedSimCard(newValue)
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
                          borderColor: !selectedSimCard ? colors.neutral300 : colors.blueOverlay700,
                          textAlign: 'right', 
                        },
                        '&:hover fieldset': {
                          borderColor: !selectedSimCard ? colors.neutral400 : colors.blue600,
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
              state={!selectedSimCard || Assigning ? 'active' : 'default'}
              buttonType='first'
              onClick={handleAssignDevice} 
              disabled={!selectedSimCard || Assigning}
              sx={{
                minWidth: '100px',
                height: '40px',
                fontSize: '14px', 
                ...((!selectedSimCard || Assigning) && {
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
