import React, { useState } from 'react'
import { Box, Snackbar, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComprehensiveResetDevice } from '../../api/widely'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import CustomTypography from '../designComponent/Typography'
import { WidelyContainer, WidelyHeaderSection, WidelyFormSection, WidelyButtonSection } from '../designComponent/styles/widelyStyles'
import { colors } from '../../styles/theme'

interface SimResetFormData {
  simNumber: string
  deviceName: string
}

const SimReset: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<SimResetFormData>({
    defaultValues: {
      simNumber: '',
      deviceName: ''
    }
  })

  const handleResetSim = async (data: SimResetFormData) => {
    if (!data.simNumber.trim() || !data.deviceName.trim()) {
      setErrorMessage(t('allFieldsRequired'))
      return
    }

    // בקשת אישור מהמשתמש
    const confirmed = window.confirm(
      `${t('areYouSureSimReset')} ${data.simNumber}?\n\n${t('warningSimReset')}`
    )

    if (!confirmed) return

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await ComprehensiveResetDevice(data.simNumber, data.deviceName)
      setSuccessMessage(t('simResetSuccess'))
      reset() // איפוס הטופס לאחר הצלחה
    } catch (error: any) {
      console.error('Error resetting SIM:', error)
      const errorMsg = error?.response?.data?.message || error?.message || t('simResetError')
      setErrorMessage(`${t('simResetFailed')}: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WidelyContainer>
      <WidelyHeaderSection>
        <CustomTypography 
          text={t('simReset')} 
          variant="h1" 
          weight="medium" 
          color={colors.blue600} 
        />
      </WidelyHeaderSection>

      <WidelyFormSection flexDirection="column" gap={3} alignItems="stretch">
        <CustomTypography 
          text={t('simResetDescription')} 
          variant="h5" 
          weight="regular"
          color={colors.neutral700}
        />

        <CustomTextField
          control={control}
          name="simNumber"
          label={t('simNumber')}
          placeholder={t('enterSimNumber')}
          rules={{ 
            required: t('simNumberRequired'),
            pattern: {
              value: /^\d+$/,
              message: t('simNumberOnlyNumbers')
            }
          }}
          errorMessage={errors.simNumber?.message}
          height="44px"
        />

        <CustomTextField
          control={control}
          name="deviceName"
          label={t('newDeviceName')}
          placeholder={t('enterDeviceName')}
          rules={{ 
            required: t('deviceNameRequired'),
            minLength: {
              value: 2,
              message: t('deviceNameMinLength')
            }
          }}
          errorMessage={errors.deviceName?.message}
          height="44px"
        />

        {errorMessage && (
          <Box sx={{ 
            background: colors.red100, 
            border: `1px solid ${colors.red500}`, 
            borderRadius: '8px', 
            padding: '12px',
            marginTop: '16px'
          }}>
            <CustomTypography 
              text={errorMessage} 
              variant="h5" 
              color={colors.red500}
              weight="medium"
            />
          </Box>
        )}

        {successMessage && (
          <Box sx={{ 
            background: colors.green100, 
            border: `1px solid ${colors.green500}`, 
            borderRadius: '8px', 
            padding: '12px',
            marginTop: '16px'
          }}>
            <CustomTypography 
              text={successMessage} 
              variant="h5" 
              color={colors.green500}
              weight="medium"
            />
          </Box>
        )}
      </WidelyFormSection>

      <WidelyButtonSection>
        <CustomButton
          label={isLoading ? t('processing') : t('resetSim')}
          onClick={handleSubmit(handleResetSim)}
          buttonType="first"
          size="large"
          disabled={isLoading}
        />
      </WidelyButtonSection>

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
    </WidelyContainer>
  )
}

export default SimReset