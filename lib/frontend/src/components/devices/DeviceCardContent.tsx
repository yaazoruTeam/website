import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Comment, EntityType, SimCard } from '@model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'
import { getCommentsByEntityTypeAndEntityId } from '../../api/comment'
import EditDeviceForm from './EditDeviceForm'
import SamsungDetails from './samsungDetails'

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
    if (onDeviceUpdate) {
      onDeviceUpdate()
    }
  }

  return (
    <Box>
      {/* טופס פרטי המכשיר */}
      <DeviceForm
        key={lastComment?.comment_id || 'no-comment'}
        initialValues={{
          device_number: simCardState.device?.device_number || '',
          IMEI_1: simCardState.device?.IMEI_1 || '',
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
        deviceId={simCardState.device?.device_id?.toString()}//check this
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
      />

      {showEditDevice && simCardState.device && (
        <EditDeviceForm
          open={showEditDevice}
          onClose={() => setShowEditDevice(false)}
          onSuccess={handleEditDeviceSuccess}
          device={simCardState.device}
        />
      )}

      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails simNumber={simCardState.simNumber} />
      </Box>

      {simCardState.device &&
        < Box sx={{ marginTop: '20px' }}>
          <SamsungDetails serialNumber={simCardState.device?.serialNumber} />
        </Box>
      }

    </Box >
  )
}

export default DeviceCardContent
