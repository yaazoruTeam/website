import { Box } from '@mui/system'
import React, { useState } from 'react'
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

export interface deviceFormInputs {
  SIM_number: string
  IMEI_1: string
  mehalcha_number: string
  model: string
  received_at: string //להוסיף את זה לטבלה מכשירים //תאריך קבלת המכשיר
  planEndDate: string //להוסיף את זה לטבלת מכשירים     //תאריך סיום התוכנית - 5 שנים מאז הקבלה של המכשיר
  filterVersion: string //להוסיף את זה לטבלת מכשירים//גרסת סינון
  deviceProgram: string //להוסיף את זה לטבלת מכשירים    //תכנית מכשיר
  notes: string //לבדות איך בדיוק לבצע את זה!
  //הערות מכשיר

  //נתוני סים

  //פרטים שקיימים כבר על מכשיר ולא צריך אותם כאן
  // device_id: string;
  // device_number: string;
  // status: string;
}

interface DeviceFormProps {
  initialValues?: deviceFormInputs
  deviceId?: string
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  initialValues,
  deviceId,
  lastCommentDate,
  lastComment,
  onCommentsRefresh,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { control } = useForm<deviceFormInputs>({
    defaultValues: initialValues || {
      SIM_number: '',
      IMEI_1: '',
      mehalcha_number: '',
      model: '',
      received_at: '',
      planEndDate: '',
      filterVersion: '',
      deviceProgram: '',
      notes: '',
    },
  })

  return (
    <Box
      sx={{
        backgroundColor: colors.c6,
        direction: 'rtl',
        padding: '28px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='SIM_number' label={t('SIM_number')} />
        <CustomTextField control={control} name='IMEI_1' label={t('IMEI_1')} />
        <CustomTextField control={control} name='mehalcha_number' label={t('mehalcha_number')} />
        <CustomTextField control={control} name='model' label={t('model')} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='received_at' label={t('dateReceiptDevice')} />
        <CustomTextField control={control} name='planEndDate' label={t('programEndDate')} />
        <CustomTextField control={control} name='filterVersion' label={t('filterVersion')} />
        <CustomTextField control={control} name='deviceProgram' label={t('deviceProgram')} />
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
    </Box>
  )
}

export default DeviceForm
