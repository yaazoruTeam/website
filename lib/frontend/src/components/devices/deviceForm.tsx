import { Box } from '@mui/system'
import React, { useState } from 'react'
import { colors } from '../../styles/theme'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CustomButton } from '../designComponent/Button'
import { Snackbar, Alert } from '@mui/material'
import {
  ChatModalContainer,
  ChatModalOverlay,
  CustomerCommentsSection,
} from '../designComponent/styles/chatCommentCardStyles'
import ChatBot from '../ChatBot/ChatBot'
import { EntityType } from '@model'
import ChatCommentCard from '../designComponent/ChatCommentCard'
import ArrowToChatComments from '../designComponent/ArrowToChatComments'
import CustomTypography from '../designComponent/Typography'

export interface deviceFormInputs {
  device_number: string
  // SIM_number: string
  IMEI_1: string
  // mehalcha_number: string
  model: string
  serialNumber: string
  registrationDate: string
  received_at: string //להוסיף את זה לטבלה מכשירים //תאריך קבלת המכשיר
  planEndDate: string //להוסיף את זה לטבלת מכשירים     //תאריך סיום התוכנית - 5 שנים מאז הקבלה של המכשיר
  // plan: string //מסלול
  notes: string //לבדות איך בדיוק לבצע את זה
}

interface DeviceFormProps {
  initialValues?: deviceFormInputs
  deviceId?: string
  customerDeviceId?: string
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
  onSave?: (planEndDate: string) => Promise<void>
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  initialValues,
  deviceId,
  customerDeviceId,
  lastCommentDate,
  lastComment,
  onCommentsRefresh,
  onSave,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, getValues, formState: { isDirty } } = useForm<deviceFormInputs>({
    defaultValues: initialValues || {
      // device_number: '',
      // SIM_number: '',//מספר סידורי במקום זה 
      IMEI_1: '',//V
      // mehalcha_number: '',//X
      model: '',//V
      serialNumber: '',
      registrationDate: '', //תאריך רישום המכשיר
      // purchaseDate: '',
      //תאריך רישום המכשיר
      received_at: '',//תאריך קבלת המכשיר
      planEndDate: '',//תאריך סיום התוכנית
      // Plan: '',//מסלול
      notes: '',
    },
  })

  const handleSave = async () => {
    if (!customerDeviceId) {
      setErrorMessage(t('errorSavingData'))
      return
    }

    setIsSaving(true)
    try {
      const values = getValues()
      console.log('Saving planEndDate:', values.planEndDate)
      
      if (onSave) {
        await onSave(values.planEndDate)
      }
      
      setSuccessMessage(t('dataSavedSuccessfully'))
    } catch (error) {
      console.error('Error saving plan end date:', error)
      setErrorMessage(t('errorSavingData'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.neutral0,
        direction: 'rtl',
        padding: '28px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb:'40px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap:1 }}>
          <CustomTypography
            text={t('deviceData')}
            variant='h3'
            weight='medium'
          />
          <CustomTypography
            text={initialValues ? initialValues.device_number : ''}
            variant='h4'
            weight='regular'
          />
        </Box>
        
        {isDirty && (
          <CustomButton
            label={isSaving ? t('saving') : t('save')}
            buttonType="third"
            size="small"
            onClick={handleSave}
            disabled={isSaving}
          />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        {/* <CustomTextField control={control} name='device_number' label={t('device_number')} /> */}
        {/* <CustomTextField control={control} name='SIM_number' label={t('SIM_number')}
         /> */}
        <CustomTextField control={control} name='serialNumber' label={t('serialNumber')} />
        <CustomTextField control={control} name='IMEI_1' label={t('IMEI_1')} />
        <CustomTextField control={control} name='model' label={t('modelDevice')} />
        {/* <CustomTextField control={control} name='mehalcha_number' label={t('mehalcha_number')} /> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        {/* <CustomTextField control={control} name='model' label={t('model')} /> */}
        {/* <CustomTextField control={control} name='serialNumber' label={t('serialNumber')} /> */}
        <CustomTextField control={control} name='registrationDate' label={t('registrationDateDevice')} disabled />
        <CustomTextField control={control} name='received_at' label={t('dateReceiptDevice')} disabled />
        <CustomTextField 
          control={control} 
          name='planEndDate' 
          label={t('programEndDate')} 
          type="date"
        />
      </Box>
      {/* <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      > */}
        {/* <CustomTextField control={control} name='Plan' label={t('plan')} /> */}
      {/* </Box> */}
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
        }}
      ></Box>

      {/* Device Comments Section with Chat Button */}
      <CustomerCommentsSection>
        <ChatCommentCard
          commentsType={t('deviceComments')}
          lastCommentDate={lastCommentDate || ''}
          lastComment={lastComment || 'אין הערות קודמות עבור המכשיר'}
          chatButton={
            <ArrowToChatComments
              onClick={() => {
                setIsChatOpen(true)
              }}
            />
          }
        />
      </CustomerCommentsSection>

      {/* Chat Modal */}
      {isChatOpen && deviceId && (
        <ChatModalOverlay
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false)
              // רענון ההערות לאחר סגירת הצ'אט
              if (onCommentsRefresh) {
                onCommentsRefresh()
              }
            }
          }}
        >
          <ChatModalContainer>
            <ChatBot
              entityType={EntityType.Device}
              entityId={deviceId}
              onClose={() => {
                setIsChatOpen(false)
                // רענון ההערות לאחר סגירת הצ'אט
                if (onCommentsRefresh) {
                  onCommentsRefresh()
                }
              }}
              commentType={t('deviceComments')}
            />
          </ChatModalContainer>
        </ChatModalOverlay>
      )}

      {/* הודעות הצלחה ושגיאה */}
      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
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

export default DeviceForm
