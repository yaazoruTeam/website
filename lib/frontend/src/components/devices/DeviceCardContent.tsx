import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Comment, EntityType, SimCard, WidelyDeviceDetails } from '@model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'
import { getCommentsByEntityTypeAndEntityId } from '../../api/comment'
import EditDeviceForm from './EditDeviceForm'
import SamsungDetails from './samsungDetails'
import { updateSimCard } from '../../api/simCard'

interface DeviceCardContentProps {
  simCard: SimCard.Model
  onDeviceUpdate?: () => void
  onChatOpenChange?: (isOpen: boolean) => void
}

const DeviceCardContent: React.FC<DeviceCardContentProps> = ({
  simCard,
  onChatOpenChange,
  onDeviceUpdate,
}) => {
  const [lastComment, setLastComment] = useState<Comment.Model | null>(null)
  const [showEditDevice, setShowEditDevice] = useState(false)
  const [simCardState, setSimCardState] = useState<SimCard.Model>(simCard)
  const [forceWidelyRefresh, setForceWidelyRefresh] = useState(0)

  // הבאת ההערה האחרונה של המכשיר
  const fetchLastComment = useCallback(async () => {
    if (!simCardState.device?.device_id) return
    try {
      const response = await getCommentsByEntityTypeAndEntityId(
        EntityType.DEVICE,
        simCardState.device.device_id.toString(),
        1
      )

      if (response.data && response.data.length > 0) {
        setLastComment(response.data[0])
      } else {
        setLastComment(null)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }, [simCardState.device?.device_id])

  useEffect(() => {
    fetchLastComment()
  }, [fetchLastComment])

  useEffect(() => {
    setSimCardState(simCard)
  }, [simCard])

  const handleEditDeviceSuccess = async () => {
    setShowEditDevice(false)
    // Trigger Widely refresh when device is updated
    setForceWidelyRefresh(prev => prev + 1)
    if (onDeviceUpdate) {
      onDeviceUpdate()
    }
  }

  // עדכון אוטומטי של IMEI_1 מנתוני Widely אם חסר
  const handleUpdateImeiFromWidely = useCallback(
    async (widelyDetails: WidelyDeviceDetails.Model) => {
      try {
        // בדיקה: אם אין IMEI_1 בSIM card וכן יש IMEI תקף מ-Widely (לא "Not Available")
        if (!simCardState.IMEI_1 && widelyDetails.imei1 && widelyDetails.imei1 !== 'Not Available') {
          // עדכון SIM card עם ה-IMEI מ-Widely
          await updateSimCard(simCardState.simCard_id, {
            IMEI_1: widelyDetails.imei1,
          })

          // עדכון ה-state המקומי
          setSimCardState((prev) => ({
            ...prev,
            IMEI_1: widelyDetails.imei1,
          }))
        }
      } catch (error) {
        console.error('[DeviceCardContent] Failed to update IMEI_1:', error)
      }
    },
    [simCardState.simCard_id, simCardState.IMEI_1]
  )

  return (
    <Box>
      <Box>imei::  {simCardState.IMEI_1 || '❌ Not Available'}</Box>

      {/* טופס פרטי המכשיר */}
      <DeviceForm
        key={lastComment?.comment_id || 'no-comment'}
        initialValues={{
          device_number: simCardState.device?.device_number || '',
          IMEI_1: simCardState.device?.IMEI_1 || '', //מה לשלוח כאן IMEI מהסים ואו מהמכשיר? TODO בינתיים שלחתי את של המכשיר כי אני לא מציגה את השדה של IMEI בטופס של מכשיר
          model: simCardState.device?.model || '',
          serialNumber: simCardState.device?.serialNumber || '',
          registrationDate: simCardState.created_at
            ? formatDateToString(new Date(simCardState.created_at))
            : '',
          received_at: simCardState.receivedAt
            ? formatDateToString(new Date(simCardState.receivedAt))
            : '',
          planEndDate: simCardState.planEndDate
            ? formatDateToString(new Date(simCardState.planEndDate))
            : '',
          notes: '',
        }}
        deviceId={simCardState.device?.device_id?.toString()}//TODO: להוסיף ההערות לסים
        simNumber={simCardState.simNumber}
        lastCommentDate={
          lastComment
            ? new Date(lastComment.created_at).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            : undefined
        }
        lastComment={lastComment ? lastComment.content : undefined}
        onCommentsRefresh={fetchLastComment}
        onChatOpenChange={onChatOpenChange}
        onEditClick={() => setShowEditDevice(true)}
        isSimCard={!simCardState.device}
      />

      {showEditDevice && /*simCardState.device &&*/ (
        <EditDeviceForm
          open={showEditDevice}
          onClose={() => setShowEditDevice(false)}
          onSuccess={handleEditDeviceSuccess}
          simCard={simCardState}
        />
      )}
      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails 
          key={forceWidelyRefresh}
          simNumber={simCardState.simNumber}
          onWidelyDetailsLoaded={handleUpdateImeiFromWidely}
        />
      </Box>

      {simCardState.device &&
        <Box sx={{ marginTop: '20px' }}>
          <SamsungDetails serialNumber={simCardState.device?.serialNumber} />
        </Box>
      }
    </Box >
  )
}

export default DeviceCardContent
