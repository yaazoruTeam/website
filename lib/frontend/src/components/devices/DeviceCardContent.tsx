import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Device, CustomerDevice, Comment, EntityType } from '@model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'
import { getCommentsByEntityTypeAndEntityId } from '../../api/comment'
import { getLineCancellationStatus } from '../../api/widely'

interface DeviceCardContentProps {
  device: Device.Model
  customerDevice?: CustomerDevice.Model
}

const DeviceCardContent: React.FC<DeviceCardContentProps> = ({ device, customerDevice }) => {
  const [lastComment, setLastComment] = useState<Comment.Model | null>(null)
  const [cancellationStatus, setCancellationStatus] = useState<{ isCancelled: boolean; cancellationDate?: string; cancellationReason?: string } | null>(null)

  // Debug: הדפסת ה-customerDevice כדי לראות מה יש בו
  useEffect(() => {
    console.log('CustomerDevice:', customerDevice)
    console.log('CustomerDevice ID:', customerDevice?.customerDevice_id)
  }, [customerDevice])

  // הבאת ההערה האחרונה של המכשיר
  const fetchLastComment = useCallback(async () => {
    if (!device.device_id) return

    try {
      const response = await getCommentsByEntityTypeAndEntityId(
        EntityType.Device,
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


  // בדיקת סטטוס ביטול קו ושמירה ב-localStorage
  useEffect(() => {
    const fetchCancellationStatus = async () => {
      if (!device.SIM_number) return
      try {
        const status = await getLineCancellationStatus(device.SIM_number)
        setCancellationStatus(status)
        // שמירה ב-localStorage
        localStorage.setItem(
          `cancellationStatus_${device.SIM_number}`,
          JSON.stringify(status)
        )
      } catch (e) {
        // אם יש שגיאה, ננסה לקרוא מה-localStorage
        const local = localStorage.getItem(`cancellationStatus_${device.SIM_number}`)
        if (local) {
          setCancellationStatus(JSON.parse(local))
        }
      }
    }
    fetchCancellationStatus()
  }, [device.SIM_number])

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
          IMEI_1: device.IMEI_1,
          model: device.model,
          serialNumber: device.serialNumber || '',
          registrationDate: device.registrationDate ? formatDateToString(new Date(device.registrationDate)) : '',
          received_at: customerDevice?.receivedAt 
            ? formatDateToString(new Date(customerDevice.receivedAt))
            : '',
          planEndDate: '', // הוספת planEndDate כערך ריק כדי למנוע שגיאת קומפילציה
          notes: '',
        }}
        deviceId={device.device_id?.toString()}
        customerDeviceId={customerDevice?.customerDevice_id}
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
      />
      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails simNumber={device.SIM_number} />
        {/* הצגת סטטוס ביטול קו */}
        {cancellationStatus?.isCancelled && (
          <Box sx={{ color: 'red', fontSize: '0.9em', mt: 1 }}>
            {cancellationStatus.cancellationReason ? (
              <>
                <div>{cancellationStatus.cancellationReason}</div>
                {cancellationStatus.cancellationDate && (
                  <div>{`(בוטל בתאריך: ${cancellationStatus.cancellationDate})`}</div>
                )}
              </>
            ) : (
              <div>הקו בוטל</div>
            )}
          </Box>
        )}
        {/* דוגמה לשינוי כפתור ביטול קו */}
        {/* הכפתור לא יוצג אם הקו בוטל */}
        {!cancellationStatus?.isCancelled && (
          <button style={{ marginTop: 8 }}>ביטול קו</button>
        )}
      </Box>
    </Box>
  )
}

export default DeviceCardContent
