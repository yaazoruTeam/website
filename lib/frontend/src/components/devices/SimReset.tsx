import React, { useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComprehensiveResetDevice, getWidelyDetailsPublic } from '../../api/widely'
import { WidelyDeviceDetails } from '@model'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import {
  SimResetContainer,
  SimResetCard,
  SimResetCardContent,
  SimResetHeader,
  SimResetFormSection,
  SimResetDeviceInfoBox,
  SimResetDeviceInfoContent,
  SimResetErrorBox,
  SimResetSuccessBox,
  SimResetButtonContainer
} from '../designComponent/styles/simResetStyles'

interface SimResetFormData {
  simLastSixDigits: string
}

const SimReset: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<WidelyDeviceDetails.Model | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<SimResetFormData>({
    defaultValues: {
      simLastSixDigits: ''
    }
  })

  const checkDeviceStatus = async (data: SimResetFormData) => {
    if (!data.simLastSixDigits.trim()) {
      setErrorMessage(t('allFieldsRequired'))
      return
    }

    const fullSimNumber = `8997212330000${data.simLastSixDigits}`
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

  const handleResetSim = async (data: SimResetFormData) => {
    if (!data.simLastSixDigits.trim()) {
      setErrorMessage(t('allFieldsRequired'))
      return
    }

    // בניית מספר הסים המלא
    const fullSimNumber = `8997212330000${data.simLastSixDigits}`

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

      // ביצוע איפוס מקיף
      console.log('[SimReset] Starting comprehensive reset with parameters:', {
        endpoint_id: deviceDetails.endpoint_id,
        device_name: deviceDetails.device_info.name,
        sim_number: fullSimNumber,
        device_status: deviceDetails.status
      })
      
      const resetResult = await ComprehensiveResetDevice(deviceDetails.endpoint_id, deviceDetails.device_info.name)
      
      console.log('[SimReset] Comprehensive reset completed:', resetResult)
      
      // בדיקה אם האיפוס הצליח באמת
      if (resetResult.success && resetResult.data?.newEndpointId) {
        console.log('[SimReset] Reset successful, new endpoint ID:', resetResult.data.newEndpointId)
        setSuccessMessage(`${t('simResetSuccess')} - Endpoint ID חדש: ${resetResult.data.newEndpointId}`)
      } else {
        console.warn('[SimReset] Reset may have failed:', resetResult)
        setSuccessMessage(t('simResetSuccess'))
      }
      
      reset() // איפוס הטופס לאחר הצלחה
    } catch (error: unknown) {
      console.error('Error resetting SIM:', error)
      let errorMsg = t('simResetError')
      
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
      
      setErrorMessage(`${t('simResetFailed')}: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SimResetContainer maxWidth="md">
        <SimResetCard>
          <SimResetCardContent>
            <SimResetHeader>
              <CustomTypography 
                text={t('simReset')} 
                variant="h1" 
                weight="medium" 
                color={colors.blue600} 
              />
            </SimResetHeader>

            <SimResetFormSection>

        <CustomTextField
          control={control}
          name="simLastSixDigits"
          placeholder={t('enterSimLastSixDigits')}
          rules={{ 
            required: t('simNumberRequired'),
            pattern: {
              value: /^\d{6}$/,
              message: t('simNumberSixDigitsOnly')
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
              <SimResetDeviceInfoBox>
            <CustomTypography 
              text={t('deviceInformation')} 
              variant="h4" 
              color={colors.blue700}
              weight="medium"
            />
                <SimResetDeviceInfoContent>
              <CustomTypography text={`${t('deviceName')}: ${deviceInfo.device_info.name}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('deviceModel')}: ${deviceInfo.device_info.brand} ${deviceInfo.device_info.model}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('deviceStatus')}: ${deviceInfo.status}`} variant="h5" weight="regular" />
              <CustomTypography text={`Endpoint ID: ${deviceInfo.endpoint_id}`} variant="h5" weight="regular" />
              <CustomTypography text={`${t('activeStatus')}: ${deviceInfo.active ? t('active') : t('inactive')}`} variant="h5" weight="regular" />
                </SimResetDeviceInfoContent>
              </SimResetDeviceInfoBox>
        )}

        {errorMessage && (
              <SimResetErrorBox>
            <CustomTypography 
              text={errorMessage} 
              variant="h5" 
              color={colors.red500}
              weight="medium"
            />
              </SimResetErrorBox>
        )}

        {successMessage && (
              <SimResetSuccessBox>
            <CustomTypography 
              text={successMessage} 
              variant="h5" 
              color={colors.green500}
              weight="medium"
            />
              </SimResetSuccessBox>
        )}
              <SimResetButtonContainer>
        <CustomButton
          label={isLoading ? t('processing') : t('resetSim')}
          onClick={handleSubmit(handleResetSim)}
          buttonType="first"
          size="large"
          disabled={isLoading}
        />
              </SimResetButtonContainer>
            </SimResetFormSection>
          </SimResetCardContent>
        </SimResetCard>
      </SimResetContainer>

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

export default SimReset