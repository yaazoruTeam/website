import { Box } from '@mui/system'
import React, { useState, useCallback, useEffect } from 'react'
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
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import ImeiDetailsModal from './ImeiDetailsModal'
import { getWidelyDetails } from '../../api/widely'
import { getDeviceInfo as getSamsungDeviceInfo } from '../../api/samsung'
import { WidelyDeviceDetails } from '@model'
import { CustomButton } from '../designComponent/Button'

export interface deviceFormInputs {
  device_number: string
  IMEI_1: string
  model: string
  serialNumber: string
  registrationDate: string
  received_at: string
  planEndDate: string
  notes: string
}

interface DeviceFormProps {
  initialValues?: deviceFormInputs
  deviceId?: string
  simNumber?: string
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
  onEditClick?: () => void
  onChatOpenChange?: (isOpen: boolean) => void
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  initialValues,
  deviceId,
  simNumber,
  lastCommentDate,
  lastComment,
  onCommentsRefresh,
  onEditClick,
  onChatOpenChange,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isImeiModalOpen, setIsImeiModalOpen] = useState(false)
  const [widelyImei, setWidelyImei] = useState<string | undefined>(undefined)
  const [samsungImei, setSamsungImei] = useState<string | undefined>(undefined)

  // עדכון הקומפוננטה האב כשהצ'אט נפתח/נסגר
  useEffect(() => {
    if (onChatOpenChange) {
      onChatOpenChange(isChatOpen)
    }
  }, [isChatOpen, onChatOpenChange])

  const { control } = useForm<deviceFormInputs>({
    defaultValues: initialValues || {
      IMEI_1: '',
      model: '',
      serialNumber: '',
      registrationDate: '',
      received_at: '',
      planEndDate: '',
      notes: '',
      device_number: '',
    },
  })

  // Fetch Widely IMEI when component mounts
  const fetchWidelyImei = useCallback(async () => {
    if (!simNumber) return

    try {
      const details: WidelyDeviceDetails.Model = await getWidelyDetails(simNumber)
      setWidelyImei(details.imei1)
    } catch (error) {
      console.error('Error fetching Widely IMEI:', error)
      setWidelyImei(undefined)
    }
  }, [simNumber])

  useEffect(() => {
    if (simNumber) {
      fetchWidelyImei()
    }
  }, [fetchWidelyImei, simNumber])

  // Fetch Samsung IMEI when serialNumber exists
  const fetchSamsungImei = useCallback(async () => {
    if (!initialValues?.serialNumber) return
    try {
      const deviceInfo = await getSamsungDeviceInfo(initialValues.serialNumber)
      setSamsungImei(deviceInfo.imei1)
    } catch (error) {
      console.error('Error fetching Samsung IMEI:', error)
      setSamsungImei(undefined)
    }
  }, [initialValues?.serialNumber])

  useEffect(() => {
    if (initialValues?.serialNumber) {
      fetchSamsungImei()
    }
  }, [fetchSamsungImei, initialValues?.serialNumber])

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
          <CustomTextField 
          control={control} 
          name='IMEI_1' 
          label={t('IMEI_1')}
          icon={
            <Box
              onClick={(e) => {
                e.stopPropagation()
                setIsImeiModalOpen(true)
              }}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: colors.blueOverlay100,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: colors.blueOverlay200,
                },
              }}
            >
              <InformationCircleIcon
                style={{
                  width: '20px',
                  height: '20px',
                  color: colors.blue700,
                }}
              />
            </Box>
          }
        />
          <CustomTextField control={control} name='model' label={t('modelDevice')} />
          {/* <CustomTextField control={control} name='mehalcha_number' label={t('mehalcha_number')} /> */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '40px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ minWidth: isChatOpen ? 'max-content' : 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '40px', gap: 1 }}>
              <CustomTypography text={t('deviceData')} variant='h3' weight='medium' />
              <CustomTypography
                text={initialValues ? initialValues.device_number : ''}
                variant='h4'
                weight='regular'
              />
            </Box>
            {onEditClick && (
              <CustomButton
                label={t('editDevice')}
                state='default'
                size='large'
                buttonType='first'
                onClick={onEditClick}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* שדות פרטי מכשיר */}
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='serialNumber' label={t('serialNumber')} />
        <CustomTextField control={control} name='IMEI_1' label={t('IMEI_1')} />
        <CustomTextField control={control} name='model' label={t('modelDevice')} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='registrationDate' label={t('registrationDateDevice')} />
        <CustomTextField control={control} name='received_at' label={t('dateReceiptDevice')} />
        <CustomTextField control={control} name='planEndDate' label={t('programEndDate')} />
      </Box>

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
              if (onCommentsRefresh) onCommentsRefresh()
            }
          }}
        >
          <ChatModalContainer>
            <ChatBot
              entityType={EntityType.DEVICE}
              entityId={deviceId}
              onClose={() => {
                setIsChatOpen(false)
                if (onCommentsRefresh) onCommentsRefresh()
              }}
              commentType={t('deviceComments')}
            />
          </ChatModalContainer>
        </ChatModalOverlay>
      )}

      <ImeiDetailsModal
        open={isImeiModalOpen}
        onClose={() => setIsImeiModalOpen(false)}
        imeiFromDatabase={initialValues?.IMEI_1 || ''}
        imeiFromSim={widelyImei}
        imeisamsung={samsungImei}
      />
    </Box>
  )
}

export default DeviceForm
