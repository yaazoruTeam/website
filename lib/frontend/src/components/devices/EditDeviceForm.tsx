import React, { useState, useEffect, useCallback } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { updateDevice } from '../../api/device'
import { Device } from '@model'
import { extractErrorMessage } from '../../utils/errorHelpers'

interface EditDeviceFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  device: Device.Model
}

interface DeviceFormData {
  device_number: string
  SIM_number: string
  IMEI_1: string
  serialNumber: string
  model: string
}

const EditDeviceForm: React.FC<EditDeviceFormProps> = ({ open, onClose, onSuccess, device }) => {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')

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

  const { control, handleSubmit, reset } = useForm<DeviceFormData>({
    defaultValues: {
      device_number: device.device_number || '',
      SIM_number: device.SIM_number || '',
      IMEI_1: device.IMEI_1 || '',
      serialNumber: device.serialNumber || '',
      model: device.model || '',
    }
  })

  const onSubmit = useCallback(async (data: DeviceFormData) => {
    try {
      const updateData = {
        ...data,
        device_id: device.device_id!.toString(),
        status: device.status,
        purchaseDate: device.purchaseDate,
        registrationDate: device.registrationDate,
        plan: device.plan,
      }
      
      await updateDevice(updateData, device.device_id!)

      onClose()
      onSuccess()
    } catch (error: unknown) {
      const errorMsg = extractErrorMessage(error, t('deviceUpdateFailed'))
      setErrorMessage(errorMsg)
    }
  }, [device, onClose, onSuccess, t])

  useEffect(() => {
    if (open) {
      reset({
        device_number: device.device_number || '',
        SIM_number: device.SIM_number || '',
        IMEI_1: device.IMEI_1 || '',
        serialNumber: device.serialNumber || '',
        model: device.model || '',
      })
    }
  }, [open, device, reset])

  const handleClose = () => {
    setErrorMessage(null)
    onClose()
  }

  const handleSave = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <CustomModal open={open} onClose={handleClose} maxWidth={600}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <CustomTypography
          text={t('editingDevice')}
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
        />
        <CustomTextField
          control={control}
          name="model"
          label={t('deviceModel')}
          rules={{ required: t('requiredField') }}
        />
      </Box>

      {/* Second row: device_number and SIM_number */}
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
          rules={getNumericFieldRules()}
        />
        <CustomTextField
          control={control}
          name="SIM_number"
          label={t('simNumber')}
          inputProps={numericInputProps}
          rules={getNumericFieldRules()}
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
          rules={getNumericFieldRules()}
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
