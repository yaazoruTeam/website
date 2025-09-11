import React from 'react'
import { Box } from '@mui/material'
import { colors } from '../../styles/theme'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import StatusTag from './Status'
import CustomTypography from './Typography'
import { useTranslation } from 'react-i18next'

interface StatusCardProps {
  onStatusSelect: (status: 'active' | 'inactive') => Promise<void>
}

const StatusCard: React.FC<StatusCardProps> = ({ onStatusSelect }) => {
  const { t } = useTranslation()

  const handleClick = async (status: 'active' | 'inactive') => {
    await onStatusSelect(status)
  }

  return (
    <Box
      sx={{
        background: colors.neutral0,
        width: '100%',
        height: '100%',
        borderRadius: 4,
        outline: `1px solid ${colors.blueOverlay700}`,
        outlineOffset: '-1px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: 'none',
        gridArea: '1 / 1',
        justifyContent: 'center',
        paddingBottom: 0.5,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          py: '14px',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CustomTypography
          text={t('customerStatus')}
          weight='regular'
          variant='h1'
          sx={{
            color: colors.blue900,
            fontSize: 16,
            fontFamily: 'Heebo',
            fontWeight: 400,
            paddingRight: 5.3,
            marginTop: -0.3,
          }}
        ></CustomTypography>
      </Box>
      <ChevronDownIcon
        style={{
          width: '16px',
          height: '16px',
          color: '#032B40',
          position: 'absolute',
          top: 16,
          left: 10,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          height: 50,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 2,
        }}
      >
        <Box sx={{ cursor: 'pointer' }} onClick={() => handleClick('active')}>
          <StatusTag status='active' />
        </Box>
        <Box sx={{ cursor: 'pointer' }} onClick={() => handleClick('inactive')}>
          <StatusTag status='inactive' />
        </Box>
      </Box>
    </Box>
  )
}

export default StatusCard
