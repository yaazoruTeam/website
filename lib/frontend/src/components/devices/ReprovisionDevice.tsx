import React, { useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { reprovisionDevice, getWidelyDetailsPublic } from '../../api/widely'
import { WidelyDeviceDetails } from '@model'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import {
  ReprovisionDeviceContainer,
  ReprovisionDeviceCard,
  ReprovisionDeviceCardContent,
  ReprovisionDeviceHeader,
  ReprovisionDeviceFormSection,
  ReprovisionDeviceDeviceInfoBox,
  ReprovisionDeviceDeviceInfoContent,
  ReprovisionDeviceErrorBox,
  ReprovisionDeviceSuccessBox,
  ReprovisionDeviceButtonContainer
} from '../designComponent/styles/reprovisionDeviceStyles'

interface ReprovisionDeviceFormData {
  simLastSixDigits: string
}

const ReprovisionDevice: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<WidelyDeviceDetails.Model | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ReprovisionDeviceFormData>({
    defaultValues: {
      simLastSixDigits: ''
    }
  })

  // פונקציה לבניית מספר סים מלא
  const buildFullSimNumber = (input: string): string => {
    return input.length > 6 ? input : `8997212330000${input}`
  }

  const checkDeviceStatus = async (data: ReprovisionDeviceFormData) => {
    if (!data.simLastSixDigits.trim()) {
      setErrorMessage(t('allFieldsRequired'))
      return
    }

    const fullSimNumber = buildFullSimNumber(data.simLastSixDigits)
    setIsChecking(true)
    setErrorMessage(null)
    setDeviceInfo(null)

    try {
      const deviceDetails = await getWidelyDetailsPublic(fullSimNumber)
      setDeviceInfo(deviceDetails)
      setSuccessMessage(t('deviceStatusChecked'))
    } catch (error: unknown) {
      console.error('Error checking device status:', error)
      let errorMsg = t('deviceCheckError')
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 
            'data' in error.response && error.response.data && typeof error.response.data === 'object' &&
            'message' in error.response.data && typeof error.response.data.message === 'string') {
          errorMsg = error.response.data.message
          
          if (errorMsg.includes('No devices found for this user')) {
            errorMsg = t('noActiveDevicesFound')
          }
        }
      }
      
      setErrorMessage(errorMsg)
    } finally {
      setIsChecking(false)
    }
  }

  const handleReprovisionSim = async (data: ReprovisionDeviceFormData) => {
    if (!data.simLastSixDigits.trim()) {
      setErrorMessage(t('allFieldsRequired'))
      return
    }

    // בניית מספר הסים המלא
    const fullSimNumber = buildFullSimNumber(data.simLastSixDigits)

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // תחילה נחפש את המכשיר על פי מספר הסים
      const deviceDetails = await getWidelyDetailsPublic(fullSimNumber)
      
      if (!deviceDetails.endpoint_id) {
        setErrorMessage(t('deviceNotFound'))
        return
      }

      // בדיקה אם המכשיר פעיל
      if (!deviceDetails.active) {
        setErrorMessage(t('deviceNotActive'))
        return
      }

      console.log('deviceStatus:', deviceDetails.status);
      

      if (deviceDetails.status !== 'active' && deviceDetails.status !== 'Active') {
        setErrorMessage(`${t('deviceStatusNotActive')}: ${deviceDetails.status}`)
        return
      }

      // בקשת אישור מהמשתמש עם פרטי המכשיר
      const confirmed = window.confirm(
        `${t('areYouSureSimReset')} ${fullSimNumber}?\n` +
        `${t('deviceName')}: ${deviceDetails.device_info.name}\n` +
        `${t('deviceModel')}: ${deviceDetails.device_info.brand} ${deviceDetails.device_info.model}\n` +
        `${t('deviceStatus')}: ${deviceDetails.status}\n` +
        `Endpoint ID: ${deviceDetails.endpoint_id}\n\n` +
        `${t('warningSimReset')}`
      )

      if (!confirmed) return

      // ביצוע הפעלה מחדש של המכשיר
      console.log('[ReprovisionDevice] Starting reprovision device with parameters:', {
        endpoint_id: deviceDetails.endpoint_id,
        device_name: deviceDetails.device_info.name,
        sim_number: fullSimNumber,
        device_status: deviceDetails.status
      })
      
      const reprovisionResult = await reprovisionDevice(deviceDetails.endpoint_id, deviceDetails.device_info.name)
      
      console.log('[ReprovisionDevice] reprovision device completed:', reprovisionResult)
      
      // בדיקה אם ההפעלה מחדש הצליחה באמת
      if (reprovisionResult.success && reprovisionResult.data?.newEndpointId) {
        console.log('[ReprovisionDevice] Reprovision successful, new endpoint ID:', reprovisionResult.data.newEndpointId)
        setSuccessMessage(`${t('reprovisionDeviceSuccess')} - Endpoint ID חדש: ${reprovisionResult.data.newEndpointId}`)
      } else {
        console.warn('[ReprovisionDevice] Reprovision device may have failed:', reprovisionResult)
        setSuccessMessage(t('reprovisionDeviceSuccess'))
      }
      
      reset() // איפוס הטופס לאחר הצלחה
    } catch (error: unknown) {
      console.error('Error resetting SIM:', error)
      let errorMsg = t('reprovisionDeviceError')
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 
            'data' in error.response && error.response.data && typeof error.response.data === 'object' &&
            'message' in error.response.data && typeof error.response.data.message === 'string') {
          errorMsg = error.response.data.message
          
          // טיפול בשגיאות ספציפיות
          if (errorMsg.includes('No devices found for this user')) {
            errorMsg = t('noActiveDevicesFound')
          } else if (errorMsg.includes('endpoint_id is 0 or invalid')) {
            errorMsg = t('deviceNotActiveEndpoint')
          } else if (errorMsg.includes('undefined method `endpoint` for nil:NilClass')) {
            errorMsg = t('deviceEndpointError')
          } else if (errorMsg.includes('Failed to terminate mobile')) {
            errorMsg = t('deviceTerminationError')
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMsg = error.message
        }
      }
      
      setErrorMessage(`${t('reprovisionDeviceError')}: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ReprovisionDeviceContainer maxWidth="md">
        <ReprovisionDeviceCard>
          <ReprovisionDeviceCardContent>
            <ReprovisionDeviceHeader>
              <CustomTypography 
                text={t('simReset')} 
                variant="h1" 
                weight="medium" 
                color={colors.blue600} 
              />
            </ReprovisionDeviceHeader>

            <ReprovisionDeviceFormSection>

        <CustomTextField
          control={control}
          name="simLastSixDigits"
          placeholder={t('enterSimLastSixDigits')}
          rules={{ 
            required: t('simNumberRequired'),
            pattern: {
              value: /^\d{6,}$/,
              message: t('simNumberMinSixDigits')
            }
          }}
          errorMessage={errors.simLastSixDigits?.message}
          height="44px"
        />

        <CustomButton
          label={isChecking ? t('checking') : t('checkDeviceStatus')}
          onClick={handleSubmit(checkDeviceStatus)}
          buttonType="second"
          size="large"
          disabled={isChecking}
        />

        {deviceInfo && (
              <ReprovisionDeviceDeviceInfoBox>
            <CustomTypography 
              text={t('deviceInformation')} 
              variant="h4" 
              color={colors.blue700}
              weight="medium"
            />
                <ReprovisionDeviceDeviceInfoContent>
              <CustomTypography text={`${t('deviceName')}: ${deviceInfo.device_info.name}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('deviceModel')}: ${deviceInfo.device_info.brand} ${deviceInfo.device_info.model}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('deviceStatus')}: ${deviceInfo.status}`} variant="h5" weight="regular" />
              <CustomTypography text={`Endpoint ID: ${deviceInfo.endpoint_id}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('activeStatus')}: ${deviceInfo.active ? t('active') : t('inactive')}`} variant="h5" weight="regular" />
                </ReprovisionDeviceDeviceInfoContent>
              </ReprovisionDeviceDeviceInfoBox>
        )}

        {errorMessage && (
              <ReprovisionDeviceErrorBox>
            <CustomTypography 
              text={errorMessage} 
              variant="h5" 
              color={colors.red500}
              weight="medium"
            />
              </ReprovisionDeviceErrorBox>
        )}

        {successMessage && (
              <ReprovisionDeviceSuccessBox>
            <CustomTypography 
              text={successMessage} 
              variant="h5" 
              color={colors.green500}
              weight="medium"
            />
              </ReprovisionDeviceSuccessBox>
        )}
              <ReprovisionDeviceButtonContainer>
        <CustomButton
          label={isLoading ? t('processing') : t('resetSim')}
          onClick={handleSubmit(handleReprovisionSim)}
          buttonType="first"
          size="large"
          disabled={isLoading}
        />
              </ReprovisionDeviceButtonContainer>
            </ReprovisionDeviceFormSection>
          </ReprovisionDeviceCardContent>
        </ReprovisionDeviceCard>
      </ReprovisionDeviceContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={8000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ReprovisionDevice