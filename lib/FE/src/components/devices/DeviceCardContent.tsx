import React from 'react'
import { Box } from '@mui/system'
import { Device, CustomerDevice } from '../../model'
import DeviceForm from './deviceForm'
import WidelyDetails from './widelyDetails'
import { formatDateToString } from '../designComponent/FormatDate'

interface DeviceCardContentProps {
  device: Device.Model
  customerDevice?: CustomerDevice.Model
}

const DeviceCardContent: React.FC<DeviceCardContentProps> = ({ device, customerDevice }) => {
  return (
    <Box>
      {/* טופס פרטי המכשיר */}
      <DeviceForm
        initialValues={{
          SIM_number: device.SIM_number,
          IMEI_1: device.IMEI_1,
          mehalcha_number: device.mehalcha_number,
          model: device.model,
          received_at: customerDevice?.receivedAt 
            ? formatDateToString(new Date(customerDevice.receivedAt))
            : '',
          planEndDate: customerDevice?.planEndDate 
            ? formatDateToString(new Date(customerDevice.planEndDate))
            : '',
          filterVersion: customerDevice?.filterVersion || '',
          deviceProgram: customerDevice?.deviceProgram || '',
          notes: '',
        }}
      />

      {/* פרטי Widely */}
      <Box sx={{ marginTop: '20px' }}>
        <WidelyDetails simNumber={device.SIM_number} />
      </Box>
    </Box>
  )
}

export default DeviceCardContent
