import React from 'react'
import { Box } from '@mui/system'
import { Device, CustomerDevice } from '../../../model'
import CustomTypography from '../../designComponent/Typography'
import { colors } from '../../../styles/theme'
import DeviceCardContent from '../../devices/DeviceCardContent'
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface DeviceRowInlineProps {
  device: Device.Model & { customerDevice: CustomerDevice.Model }
  isOpen: boolean
  onClick: () => void
}

const DeviceRowInline: React.FC<DeviceRowInlineProps> = ({ device, isOpen, onClick }) => {
  return (
    <Box
      sx={{
        border: `1px solid ${colors.c15}`,
        borderRadius: '8px',
        marginBottom: '16px',
        overflow: 'hidden'
      }}
    >
      {/* כותרת המכשיר - לחיצה */}
      <Box
        onClick={onClick}
        sx={{
          padding: '16px',
          backgroundColor: colors.c6,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: colors.c15
          }
        }}
      >
        <Box>
          <CustomTypography
            text={device.device_number}
            variant='h1'
            weight='medium'
            color={colors.c8}
          />
        </Box>
        {isOpen ? (
          <ChevronDownIcon
            style={{
              width: '24px',
              height: '24px',
              color: colors.c11
            }}
          />
        ) : (
          <ChevronLeftIcon
            style={{
              width: '24px',
              height: '24px',
              color: colors.c11
            }}
          />
        )}
      </Box>

      {/* תוכן המכשיר - נפתח בלחיצה */}
      {isOpen && (
        <Box sx={{ padding: '16px' }}>
          <DeviceCardContent device={device} customerDevice={device.customerDevice} />
        </Box>
      )}
    </Box>
  )
}

export default DeviceRowInline
