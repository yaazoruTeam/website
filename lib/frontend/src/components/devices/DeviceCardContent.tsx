import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Device, CustomerDevice, Comment, EntityType } from '@model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'
import { getCommentsByEntityTypeAndEntityId } from '../../api/comment'

interface DeviceCardContentProps {
  device: Device.Model
  customerDevice?: CustomerDevice.Model
  onChatOpenChange?: (isOpen: boolean) => void
}

const DeviceCardContent: React.FC<DeviceCardContentProps> = ({ device, customerDevice, onChatOpenChange }) => {
  const [lastComment, setLastComment] = useState<Comment.Model | null>(null)

  // הבאת ההערה האחרונה של המכשיר
  const fetchLastComment = useCallback(async () => {
    if (!device.device_id) return

    try {
      const response = await getCommentsByEntityTypeAndEntityId(
        EntityType.DEVICE,
        device.device_id.toString(),
        1,
      )

      if (response.data && response.data.length > 0) {
        setLastComment(response.data[0])
      } else {
        setLastComment(null)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }, [device.device_id])

  useEffect(() => {
    fetchLastComment()
  }, [fetchLastComment])

  return (
    <Box>
      {/* טופס פרטי המכשיר */}
      <DeviceForm
        key={lastComment?.comment_id || 'no-comment'}
        initialValues={{
          device_number: device.device_number,
          // SIM_number: device.SIM_number,
          IMEI_1: device.IMEI_1,
          model: device.model,
          serialNumber: device.serialNumber || '',
          registrationDate: device.registrationDate ? formatDateToString(new Date(device.registrationDate)) : '',
          received_at: customerDevice?.receivedAt 
            ? formatDateToString(new Date(customerDevice.receivedAt))
            : '',
          planEndDate: customerDevice?.planEndDate
            ? formatDateToString(new Date(customerDevice.planEndDate))
            : '',
          // plan: device?.plan || '',
          // filterVersion: customerDevice?.filterVersion || '',
          // deviceProgram: customerDevice?.deviceProgram || '',
          notes: '',
        }}
        deviceId={device.device_id?.toString()}
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
      />
      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails simNumber={device.SIM_number} />
      </Box>
    </Box>
  )
}

export default DeviceCardContent
