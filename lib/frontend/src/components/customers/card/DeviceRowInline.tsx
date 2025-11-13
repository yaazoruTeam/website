import React, { useState } from 'react'
import { Box } from '@mui/system'
import { SimCard } from '@model'
import CustomTypography from '../../designComponent/Typography'
import { colors } from '../../../styles/theme'
import DeviceCardContent from '../../devices/DeviceCardContent'
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface DeviceRowInlineProps {
  simCard: SimCard.Model 
  isOpen: boolean
  onClick: () => void
}

const DeviceRowInline: React.FC<DeviceRowInlineProps> = ({ simCard, isOpen, onClick }) => {
  const [isDeviceChatOpen, setIsDeviceChatOpen] = useState(false)

  const iconStyle = {
    width: '24px',
    height: '24px',
    color: colors.blue900
  }

  return (
    <Box
      sx={{
        border: `1px solid ${colors.neutral75}`,
        borderRadius: '8px',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      {/* כותרת המכשיר - לחיצה */}
      <Box
        onClick={onClick}
        sx={{
          padding: '16px',
          backgroundColor: colors.neutral0,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: colors.neutral75
          }
        }}
      >
        <Box>
          <CustomTypography
            text={simCard.simNumber}
            variant='h1'
            weight='medium'
            color={colors.blue500}
          />
        </Box>
        {isOpen ? (
          <ChevronDownIcon style={iconStyle} />
        ) : (
          <ChevronLeftIcon style={iconStyle} />
        )}
      </Box>

      {/* תוכן המכשיר - נפתח בלחיצה */}
      {isOpen && (
        <Box 
          sx={{ 
            padding: '16px',
            width: '100%',
            overflowX: isDeviceChatOpen ? 'auto' : 'visible',
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
            minWidth: isDeviceChatOpen ? 'max-content' : 'auto',
            maxWidth: isDeviceChatOpen ? 'calc(100vw - 640px)' : '100%',
          }}>
            <DeviceCardContent 
              simCard={simCard}
              onChatOpenChange={setIsDeviceChatOpen}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DeviceRowInline
