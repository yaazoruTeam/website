import React, { useState } from 'react'
import { Box, Snackbar, Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { CustomTextField } from '../designComponent/Input'
import { CustomButton } from '../designComponent/Button'
import { useForm } from 'react-hook-form'
import { ComprehensiveResetDevice, resetVoicemailPincode, sendApn } from '../../api/widely'
import { AxiosError } from 'axios'

interface ResetSimFormData {
  simNumber: string
  endpointId: string
  newDeviceName: string
}

const ResetSim: React.FC = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, watch, reset } = useForm<ResetSimFormData>({
    defaultValues: {
      simNumber: '',
      endpointId: '',
      newDeviceName: ''
    }
  })

  const formValues = watch()

  // Handle comprehensive device reset
  const handleComprehensiveReset = async () => {
    if (!formValues.endpointId.trim()) {
      setErrorMessage(t('errorNoEndpointId'))
      return
    }

    if (!formValues.newDeviceName.trim()) {
      setErrorMessage(t('deviceNameRequired'))
      return
    }

    // Request user confirmation
    const confirmed = window.confirm(
      `${t('areYouSureComprehensiveReset')} ${formValues.endpointId}?\n\n${t('warningComprehensiveReset')}`
    )

    if (!confirmed) return

    try {
      setLoading(true)
      const result = await ComprehensiveResetDevice(formValues.endpointId, formValues.newDeviceName)

      if (result.success) {
        setSuccessMessage(
          `${t('comprehensiveResetSuccess')}\n${t('newEndpointId')}: ${result.data.newEndpointId}`
        )
        // Reset form after successful reset
        reset()
      } else {
        setErrorMessage(`${t('comprehensiveResetFailed')}: ${result.message}`)
      }
    } catch (err: AxiosError | unknown) {
      console.error('Error in comprehensive reset:', err)
      const errorMsg = err instanceof AxiosError ? 
        err.response?.data?.message || err.message : 
        t('comprehensiveResetError')
      setErrorMessage(`${t('comprehensiveResetFailed')}: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle voicemail pincode reset
  const handleResetVoicemailPincode = async () => {
    if (!formValues.endpointId.trim()) {
      setErrorMessage(t('errorNoEndpointId'))
      return
    }

    try {
      setLoading(true)
      await resetVoicemailPincode(parseInt(formValues.endpointId))
      setSuccessMessage(t('voicemailPincodeResetSuccessfully'))
    } catch (err: AxiosError | unknown) {
      console.error('Error resetting voicemail pincode:', err)
      const errorMsg = err instanceof AxiosError ? 
        err.response?.data?.message || err.message : 
        t('errorResettingVoicemailPincode')
      setErrorMessage(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Handle send APN
  const handleSendApn = async () => {
    if (!formValues.endpointId.trim()) {
      setErrorMessage(t('errorNoEndpointId'))
      return
    }

    try {
      setLoading(true)
      await sendApn(parseInt(formValues.endpointId))
      setSuccessMessage(t('apnSentSuccessfully'))
    } catch (err: AxiosError | unknown) {
      console.error('Error sending APN:', err)
      const errorMsg = err instanceof AxiosError ? 
        err.response?.data?.message || err.message : 
        t('errorSendingApn')
      setErrorMessage(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: colors.neutral0,
    borderRadius: '12px',
    boxShadow: `0 4px 20px ${colors.neutralShadow}`,
  }

  const sectionStyles = {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: colors.neutral50,
    borderRadius: '8px',
    border: `1px solid ${colors.neutral200}`,
  }

  const buttonContainerStyles = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '20px',
  }

  return (
    <Box sx={containerStyles}>
      {/* Page Header */}
      <Box sx={{ marginBottom: '32px', textAlign: 'center' }}>
        <CustomTypography 
          text={t('resetSimPage')} 
          variant="h1" 
          weight="bold" 
          color={colors.blue900} 
        />
        <CustomTypography 
          text={t('resetSimPageDescription')} 
          variant="h4" 
          weight="regular" 
          color={colors.neutral700} 
          sx={{ marginTop: '8px' }}
        />
      </Box>

      {/* Form Section */}
      <Box sx={sectionStyles}>
        <CustomTypography 
          text={t('deviceInformation')} 
          variant="h3" 
          weight="medium" 
          color={colors.blue900} 
          sx={{ marginBottom: '20px' }}
        />
        
        <Box sx={{ display: 'grid', gap: '16px', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <CustomTextField
            control={control}
            name="simNumber"
            label={t('simNumber')}
            placeholder={t('enterSimNumber')}
          />
          <CustomTextField
            control={control}
            name="endpointId"
            label={t('endpointId')}
            placeholder={t('enterEndpointId')}
          />
        </Box>
        
        <Box sx={{ marginTop: '16px' }}>
          <CustomTextField
            control={control}
            name="newDeviceName"
            label={t('newDeviceName')}
            placeholder={t('enterNewDeviceNamePlaceholder')}
          />
        </Box>
      </Box>

      {/* Reset Actions Section */}
      <Box sx={sectionStyles}>
        <CustomTypography 
          text={t('resetActions')} 
          variant="h3" 
          weight="medium" 
          color={colors.blue900} 
          sx={{ marginBottom: '20px' }}
        />
        
        <Box sx={buttonContainerStyles}>
          <CustomButton
            label={t('comprehensiveReset')}
            onClick={handleComprehensiveReset}
            buttonType="first"
            size="large"
            disabled={loading || !formValues.endpointId.trim() || !formValues.newDeviceName.trim()}
          />
          
          <CustomButton
            label={t('resetVoicemailPincode')}
            onClick={handleResetVoicemailPincode}
            buttonType="fourth"
            size="large"
            disabled={loading || !formValues.endpointId.trim()}
          />
          
          <CustomButton
            label={t('sendApn')}
            onClick={handleSendApn}
            buttonType="fourth"
            size="large"
            disabled={loading || !formValues.endpointId.trim()}
          />
        </Box>
      </Box>

      {/* Success/Error Messages */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ResetSim