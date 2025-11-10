import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { colors } from '../../styles/theme'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
  onChatOpenChange?: (isOpen: boolean) => void
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  initialValues,
  deviceId,
  lastCommentDate,
  lastComment,
  onCommentsRefresh,
  onChatOpenChange,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // עדכון הקומפוננטה האב כשהצ'אטבוט נפתח/נסגר
  useEffect(() => {
    if (onChatOpenChange) {
      onChatOpenChange(isChatOpen)
    }
  }, [isChatOpen, onChatOpenChange])

  const { control } = useForm<deviceFormInputs>({
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

  return (
    <Box
      sx={{
        backgroundColor: colors.neutral0,
        direction: 'rtl',
        padding: '28px',
        width: '100%',
        overflowX: isChatOpen ? 'auto' : 'visible',
        overflowY: 'visible',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: colors.neutral100,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.neutral350,
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: colors.neutral400,
          },
        },
      }}
    >
      <Box sx={{ 
        minWidth: isChatOpen ? 'max-content' : 'auto',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb:'40px',gap:1 }}>
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
          <CustomTextField control={control} name='registrationDate' label={t('registrationDateDevice')} />
          <CustomTextField control={control} name='received_at' label={t('dateReceiptDevice')} />
          <CustomTextField control={control} name='planEndDate' label={t('programEndDate')} />

        </Box>
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
      </Box>

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
              entityType={EntityType.DEVICE}
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
    </Box>
  )
}

export default DeviceForm
