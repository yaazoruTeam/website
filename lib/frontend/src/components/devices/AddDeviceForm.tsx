import React, { useState, useEffect, useCallback } from 'react'
import { Box, Snackbar, Alert, useMediaQuery } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { createDevice } from '../../api/device'
import { Device } from '@model'

interface AddDeviceFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface DeviceFormData {
  device_number: string
  SIM_number: string
  IMEI_1: string
  mehalcha_number: string
  model: string
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitHandler, setSubmitHandler] = useState<(() => void) | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')

  const { control, handleSubmit, reset } = useForm<DeviceFormData>({
    defaultValues: {
      device_number: '',
      SIM_number: '',
      IMEI_1: '',
      mehalcha_number: '',
      model: '',
    }
  })

  const onSubmit = useCallback(async (data: DeviceFormData) => {
    try {
      const deviceData: Omit<Device.Model, 'device_id'> = {
        ...data,
        status: 'active',
        isDonator: true,
      }

      await createDevice(deviceData)

      setSuccessMessage(t('deviceAddedSuccessfully'))

      reset()
      onClose()
      onSuccess() // Refresh the devices list
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || t('deviceAddFailed')
      setErrorMessage(errorMsg)
    }
  }, [t, reset, onClose, onSuccess])

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
      {/* <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1.5,
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
        }}
      > */}
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <CustomTypography
          text={t('addingDevice')}
          variant='h1'
          weight='bold'
          color={colors.c11}
        />
      </Box>

      {/* First row: mehalcha_number and model */}
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
          name="mehalcha_number"
          label={t('mehalchaNumber')}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          rules={{
            required: t('requiredField'),
            pattern: {
              value: /^\d+$/,
              message: t('numbersOnlyError')
            }
          }}
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
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          rules={{
            required: t('requiredField'),
            pattern: {
              value: /^\d+$/,
              message: t('numbersOnlyError')
            }
          }}
        />
        <CustomTextField
          control={control}
          name="SIM_number"
          label={t('simNumber')}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          rules={{
            required: t('requiredField'),
            pattern: {
              value: /^\d+$/,
              message: t('numbersOnlyError')
            }
          }}
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
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          rules={{
            required: t('requiredField'),
            pattern: {
              value: /^\d+$/,
              message: t('numbersOnlyError')
            }
          }}
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
