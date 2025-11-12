import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Device, CustomerDevice, Comment, EntityType } from '@model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'
import { getCommentsByEntityTypeAndEntityId } from '../../api/comment'
import EditDeviceForm from './EditDeviceForm'
import SamsungDetails from './samsungDetails'

interface DeviceCardContentProps {
  device: Device.Model
  customerDevice?: CustomerDevice.Model
  onDeviceUpdate?: () => void
  onChatOpenChange?: (isOpen: boolean) => void
}

const DeviceCardContent: React.FC<DeviceCardContentProps> = ({
  device: initialDevice,
  customerDevice,
  onChatOpenChange,
  onDeviceUpdate,
}) => {
  const [lastComment, setLastComment] = useState<Comment.Model | null>(null)
  const [showEditDevice, setShowEditDevice] = useState(false)
  const [device, setDevice] = useState<Device.Model>(initialDevice)

  // הבאת ההערה האחרונה של המכשיר
  const fetchLastComment = useCallback(async () => {
    if (!device.device_id) return

    try {
      const response = await getCommentsByEntityTypeAndEntityId(
        EntityType.DEVICE,
        device.device_id.toString(),
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
  }, [device.device_id])

  useEffect(() => {
    fetchLastComment()
  }, [fetchLastComment])

  useEffect(() => {
    setDevice(initialDevice)
  }, [initialDevice])

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
          device_number: device.device_number,
          IMEI_1: device.IMEI_1,
          model: device.model,
          serialNumber: device.serialNumber || '',
          registrationDate: device.registrationDate
            ? formatDateToString(new Date(device.registrationDate))
            : '',
          received_at: customerDevice?.receivedAt
            ? formatDateToString(new Date(customerDevice.receivedAt))
            : '',
          planEndDate: customerDevice?.planEndDate
            ? formatDateToString(new Date(customerDevice.planEndDate))
            : '',
          notes: '',
        }}
        deviceId={device.device_id?.toString()}
        simNumber={device.SIM_number}
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

      {showEditDevice && (
        <EditDeviceForm
          open={showEditDevice}
          onClose={() => setShowEditDevice(false)}
          onSuccess={handleEditDeviceSuccess}
          device={device}
        />
      )}

      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails simNumber={device.SIM_number} />
      </Box>

      {/* פרטי Samsung */}
      <Box sx={{ marginTop: '20px' }}>
        <SamsungDetails serialNumber={device.serialNumber} />
      </Box>
    </Box>
  )
}

export default DeviceCardContent
