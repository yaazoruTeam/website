import React, { useState, useEffect, useCallback } from 'react'
import { Box, Snackbar, Alert, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { Device, DeviceStatus, SimCard } from '@model'
import { extractErrorMessage } from '../../utils/errorHelpers'
import { createDeviceWithSimCard, createSimCard } from '../../api/simCard'

interface AddDeviceFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface DeviceFormData {
  device_number?: string
  simNumber: string
  IMEI_1?: string
  serialNumber?: string
  model?: string
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitHandler, setSubmitHandler] = useState<(() => void) | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')

  // Common configuration for numeric fields
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
    defaultValues: {
      device_number: '',
      simNumber: '',
      IMEI_1: '',
      serialNumber: '',
      model: '',
    }
  })

  // Watch all fields to determine mode
  const device_number = watch('device_number')
  const IMEI_1 = watch('IMEI_1')
  const model = watch('model')
  const serialNumber = watch('serialNumber')

  // Determine if it's full device + sim mode or just sim mode
  const hasDeviceFields = !!(device_number || IMEI_1 || model || serialNumber)

  const onSubmit = useCallback(async (data: DeviceFormData) => {
    try {
      // Validation: SIM number is always required
      if (!data.simNumber) {
        throw { status: 400, message: t('simNumberRequired') }
      }

      // If device fields are partially filled, require all of them
      if (hasDeviceFields) {
        if (!data.device_number || !data.IMEI_1 || !data.model || !data.serialNumber) {
          throw {
            status: 400,
            message: t('deviceAddFormValidationError'),
          }
        }

        // Full mode: Create device + simCard together
        const deviceData: Omit<Device.Model, 'device_id'> = {
          device_number: data.device_number,
          IMEI_1: data.IMEI_1,
          model: data.model,
          serialNumber: data.serialNumber,
          status: DeviceStatus.ACTIVE,
          purchaseDate: null,
          registrationDate: new Date(),
          plan: '',
        }

        const simCardData: Partial<Omit<SimCard.Model, 'simCard_id'>> = {
          simNumber: data.simNumber,
          receivedAt: new Date(),
        }

        await createDeviceWithSimCard({
          device: deviceData,
          simCard: simCardData,
        })

        setSuccessMessage(t('deviceAndSimCardAddedSuccessfully'))
      } else {
        // Minimal mode: Create only simCard
        const simCardData: Partial<Omit<SimCard.Model, 'simCard_id'>> = {
          simNumber: data.simNumber,
          receivedAt: new Date(),
        }

        await createSimCard(simCardData as Omit<SimCard.Model, 'simCard_id'>)
        setSuccessMessage(t('simCardAddedSuccessfully'))
      }

      reset()
      onClose()
      onSuccess() // Refresh the devices list
    } catch (error: unknown) {
      const errorMsg = extractErrorMessage(error, t('deviceAddFailed'))
      setErrorMessage(errorMsg)
    }
  }, [t, reset, onClose, onSuccess, hasDeviceFields])

  useEffect(() => {
    setSubmitHandler(() => handleSubmit(onSubmit))
  }, [handleSubmit, onSubmit])

  const handleClose = () => {
    reset()
    setSuccessMessage(null)
    setErrorMessage(null)
    onClose()
  }

  const handleSave = () => {
    if (submitHandler) {
      submitHandler()
    }
  }

  return (
    <CustomModal open={open} onClose={handleClose} maxWidth={600}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <CustomTypography
          text={t('addingDevice')}
          variant='h1'
          weight='bold'
          color={colors.blue900}
        />
      </Box>

      {/* Information text */}
      <Box sx={{ mb: 2, p: 1.5, backgroundColor: colors.blue100, borderRadius: 1 }}>
        <CustomTypography
          text={hasDeviceFields 
            ? t('fillAllDeviceFieldsToCreate')
            : t('enterSimNumberToCreateOnlySimCard')
          }
          variant='h5'
          weight='regular'
          color={colors.blue700}
        />
      </Box>

      {/* SIM Number - Always required */}
      <Box sx={{ mb: 2 }}>
        <CustomTextField
          control={control}
          name="simNumber"
          label={t('simNumber')}
          inputProps={numericInputProps}
          rules={getNumericFieldRules()}
        />
      </Box>

      {/* Device Fields - Optional but all required if any is filled */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 3.5,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          mb: 2,
        }}
      >
        <CustomTextField
          control={control}
          name="serialNumber"
          label={t('serialNumber')}
          rules={hasDeviceFields ? { required: t('requiredField') } : undefined}
        />
        <CustomTextField
          control={control}
          name="model"
          label={t('deviceModel')}
          rules={hasDeviceFields ? { required: t('requiredField') } : undefined}
        />
      </Box>

      {/* Second row: device_number and IMEI_1 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 3.5,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          mb: 2,
        }}
      >
        <CustomTextField
          control={control}
          name="device_number"
          label={t('deviceNumber')}
          inputProps={numericInputProps}
          rules={hasDeviceFields ? getNumericFieldRules() : undefined}
        />
        <CustomTextField
          control={control}
          name="IMEI_1"
          label="IMEI 1"
          inputProps={numericInputProps}
          rules={hasDeviceFields ? getNumericFieldRules() : undefined}
        />
      </Box>

      {/* Submit button */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <CustomButton
          label={t('save')}
          state='default'
          size={isMobile ? 'small' : 'large'}
          buttonType='first'
          onClick={handleSave}
        />
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </CustomModal>
  )
}

export default AddDeviceForm
