import React, { useState, useEffect, useCallback } from 'react'
import { Box, useMediaQuery, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { updateDevice, createDevice } from '../../api/device'
import { updateSimCard } from '../../api/simCard'
import { Device, SimCard } from '@model'
import { extractErrorMessage } from '../../utils/errorHelpers'

interface EditDeviceFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  // device?: Device.Model
  simCard: SimCard.Model
}

interface DeviceFormData {
  device_number: string
  IMEI_1: string
  serialNumber: string
  model: string
  simNumber: string
}

const EditDeviceForm: React.FC<EditDeviceFormProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  // device,
  simCard 
}) => {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width:600px)')
  
  // Determine mode: edit existing device or link SIM to new device
  // const isLinkingMode = !device
  // const isEditMode = !!device

  const numericInputProps = {
    inputMode: 'numeric' as const,
    pattern: '[0-9]*'
  }

  const getNumericFieldRules = () => ({
    required: t('requiredField'),
    pattern: {
      value: /^\d+$/,
      message: t('numbersOnlyError')
    }
  })

  const { control, handleSubmit, reset, watch } = useForm<DeviceFormData>({
    mode: 'onChange',
    defaultValues: {
      device_number: simCard.device?.device_number || '',
      IMEI_1: simCard.device?.IMEI_1 || '',
      serialNumber: simCard.device?.serialNumber || '',
      model: simCard.device?.model || '',
      simNumber: simCard?.simNumber || '',
    }
  })

  // Watch all form fields
  const currentSimNumber = watch('simNumber')
  const currentDeviceNumber = watch('device_number')
  const currentIMEI = watch('IMEI_1')
  const currentSerialNumber = watch('serialNumber')
  const currentModel = watch('model')

  // Check if only SIM number changed
  const isOnlySimChanged = () => {
    const deviceFieldsUnchanged =
      currentDeviceNumber?.trim() === (simCard.device?.device_number || '') &&
      currentIMEI?.trim() === (simCard.device?.IMEI_1 || '') &&
      currentSerialNumber?.trim() === (simCard.device?.serialNumber || '') &&
      currentModel?.trim() === (simCard.device?.model || '')
    
    const simChanged = currentSimNumber?.trim() !== simCard.simNumber?.trim()
    
    return deviceFieldsUnchanged && simChanged
  }

  // Check if any device field is partially filled
  const isDeviceFieldPartiallyFilled = () => {
    const deviceFields = [currentDeviceNumber, currentIMEI, currentSerialNumber, currentModel]
    const filledCount = deviceFields.filter(field => field?.trim()).length
    return filledCount > 0 && filledCount < 4
  }

  const onSubmit = useCallback(async (data: DeviceFormData) => {
    try {
      setErrorMessage(null)
      setIsLoading(true)

      // Case 1: Only SIM number changed - update only SIM
      if (isOnlySimChanged()) {
        await updateSimCard(simCard.simCard_id, {
          simNumber: data.simNumber,
        })
        onClose()
        onSuccess()
        return
      }

      // Case 2: Device fields are partially filled - error
      if (isDeviceFieldPartiallyFilled()) {
        setErrorMessage(t('requiredField') + ': ' + t('pleaseCompletDeviceInfo'))
        return
      }

      if (simCard.device) {
        // Case 3: Edit existing device
        await updateDevice(
          {
            device_id: simCard.device.device_id,
            device_number: data.device_number,
            IMEI_1: data.IMEI_1,
            serialNumber: data.serialNumber,
            model: data.model,
          } as Device.Model,
          Number(simCard.device.device_id)
        )

        // If SIM number also changed, update it
        const simNumberChanged = currentSimNumber?.trim() !== simCard.simNumber?.trim()
        if (simNumberChanged) {
          await updateSimCard(simCard.simCard_id, {
            simNumber: data.simNumber,
          })
        }
      } else {
        // Case 4: Link SIM to new device (create device + update SIM)
        const newDeviceData = {
          device_number: data.device_number,
          IMEI_1: data.IMEI_1,
          serialNumber: data.serialNumber,
          model: data.model,
        }

        const createdDevice = await createDevice(
          newDeviceData as Omit<Device.Model, 'device_id'>
        )

        // Link the SIM to the new device
        if (simCard) {
          await updateSimCard(simCard.simCard_id, {
            device_id: createdDevice.device_id,
          })
        }
      }

      onClose()
      onSuccess()
    } catch (error: unknown) {
      const errorMsg = extractErrorMessage(
        error,
        simCard.device ? t('deviceUpdateFailed') : t('deviceLinkingFailed')
      )
      setErrorMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [simCard, currentSimNumber, currentDeviceNumber, currentIMEI, currentSerialNumber, currentModel, onClose, onSuccess, t])

  useEffect(() => {
    if (open) {
      reset({
        device_number: simCard.device?.device_number || '',
        IMEI_1: simCard.device?.IMEI_1 || '',
        serialNumber: simCard.device?.serialNumber || '',
        model: simCard.device?.model || '',
        simNumber: simCard?.simNumber || '',
      })
      setErrorMessage(null)
    }
  }, [open, simCard, reset])

  const handleClose = () => {
    setErrorMessage(null)
    onClose()
  }

  const handleSave = () => {
    handleSubmit(onSubmit)()
  }

  // Determine button label based on context
  const getButtonLabel = () => {
    // If there's an existing device, show save
    if (simCard.device) {
      return t('save')
    }

    // If only SIM number changed, show update SIM
    if (isOnlySimChanged()) {
      return t('updateSim')
    }

    // If any device field is being filled, show link device
    if (isDeviceFieldPartiallyFilled() || 
        (currentDeviceNumber?.trim() && currentIMEI?.trim() && currentSerialNumber?.trim() && currentModel?.trim())) {
      return t('linkingDevice')
    }

    // Default: link device or update SIM
    return t('updateSim')
  }

  return (
    <CustomModal open={open} onClose={handleClose} maxWidth={600}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <CustomTypography
          text={
            simCard.device
              ? t('editingDevice')
              : t('linkingDeviceToSimCard')
          }
          variant='h1'
          weight='bold'
          color={colors.blue900}
        />
      </Box>

      {/* First row: serialNumber and model */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 3.5,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <CustomTextField
          control={control}
          name="serialNumber"
          label={t('serialNumber')}
          rules={
            isDeviceFieldPartiallyFilled() 
              ? { required: t('requiredField') }
              : {}
          }
        />
        <CustomTextField
          control={control}
          name="model"
          label={t('deviceModel')}
          rules={
            isDeviceFieldPartiallyFilled() 
              ? { required: t('requiredField') }
              : {}
          }
        />
      </Box>

      {/* Second row: device_number and simNumber */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 3.5,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <CustomTextField
          control={control}
          name="device_number"
          label={t('deviceNumber')}
          inputProps={numericInputProps}
          rules={
            isDeviceFieldPartiallyFilled()
              ? getNumericFieldRules()
              : {}
          }
        />
        <CustomTextField
          control={control}
          name="simNumber"
          label={t('simNumber')}
          rules={{ required: t('requiredField') }}
        />
      </Box>

      {/* Third row: IMEI_1 */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <CustomTextField
          control={control}
          name="IMEI_1"
          label="IMEI 1"
          inputProps={numericInputProps}
          rules={
            isDeviceFieldPartiallyFilled()
              ? getNumericFieldRules()
              : {}
          }
        />
      </Box>

      {/* Submit button */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <CustomButton
          label={t('cancel')}
          state='default'
          size={isMobile ? 'small' : 'large'}
          buttonType='second'
          onClick={handleClose}
          disabled={isLoading}
        />
        <CustomButton
          label={getButtonLabel()}
          state='default'
          size={isMobile ? 'small' : 'large'}
          buttonType='first'
          onClick={handleSave}
          disabled={isLoading}
        />
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <CircularProgress size={24} />
          <CustomTypography text={t('saving')} variant='h5' weight='regular' />
        </Box>
      )}

      {/* Error display */}
      {errorMessage && (
        <Box sx={{ mt: 2, color: 'error.main', textAlign: 'center' }}>
          {errorMessage}
        </Box>
      )}
    </CustomModal>
  )
}

export default EditDeviceForm
