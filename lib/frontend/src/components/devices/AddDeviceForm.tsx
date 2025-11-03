import React, { useState, useEffect, useCallback } from 'react'
import { Box, Snackbar, Alert, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { createDevice, updateDevice } from '../../api/device'
import { Device } from '@model'
import { extractErrorMessage } from '../../utils/errorHelpers'

interface AddDeviceFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editDevice?: Device.Model | null
}

interface DeviceFormData {
  device_number: string
  SIM_number: string
  IMEI_1: string
  serialNumber: string
  model: string
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ open, onClose, onSuccess, editDevice = null }) => {
  const { t } = useTranslation()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitHandler, setSubmitHandler] = useState<(() => void) | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')
  const isEditMode = !!editDevice

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

  const { control, handleSubmit, reset } = useForm<DeviceFormData>({
    defaultValues: {
      device_number: '',
      SIM_number: '',
      IMEI_1: '',
      serialNumber: '',
      model: '',
    }
  })

  // טעינת נתוני המכשיר במצב עריכה
  useEffect(() => {
    if (editDevice && open) {
      reset({
        device_number: editDevice.device_number || '',
        SIM_number: editDevice.SIM_number || '',
        IMEI_1: editDevice.IMEI_1 || '',
        serialNumber: editDevice.serialNumber || '',
        model: editDevice.model || '',
      })
    } else if (!open) {
      reset({
        device_number: '',
        SIM_number: '',
        IMEI_1: '',
        serialNumber: '',
        model: '',
      })
    }
  }, [editDevice, open, reset])

  const onSubmit = useCallback(async (data: DeviceFormData) => {
    try {
      if (isEditMode && editDevice) {
        // מצב עריכה - עדכון מכשיר קיים
        const deviceData: Partial<Device.Model> = {
          device_number: data.device_number,
          SIM_number: data.SIM_number,
          IMEI_1: data.IMEI_1,
          serialNumber: data.serialNumber,
          model: data.model,
        }
        await updateDevice(editDevice.device_id, deviceData)
        setSuccessMessage(t('deviceUpdatedSuccessfully'))
      } else {
        // מצב הוספה - יצירת מכשיר חדש
        const deviceData: Omit<Device.Model, 'device_id'> = {
          ...data,
          status: 'active',
          purchaseDate: null,
          registrationDate: new Date(),
          plan: '',
        }
        await createDevice(deviceData)
        setSuccessMessage(t('deviceAddedSuccessfully'))
      }

      reset()
      onClose()
      onSuccess()
    } catch (error: unknown) {
      const errorMsg = extractErrorMessage(
        error, 
        isEditMode ? t('deviceUpdateFailed') : t('deviceAddFailed')
      )
      setErrorMessage(errorMsg)
    }
  }, [t, reset, onClose, onSuccess, isEditMode, editDevice])

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
          text={isEditMode ? t('editDevice') : t('addingDevice')}
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
