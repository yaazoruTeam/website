import React from 'react'
import { Box } from '@mui/material'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'
import { useTranslation } from 'react-i18next'

interface NoResultsMessageProps {
  messageType: 'date' | 'status' | 'general'
  onClose: () => void
  showButton?: boolean
  buttonLabel?: string
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ messageType, onClose }) => {
  const { t } = useTranslation()

  const getMessage = () => {
    switch (messageType) {
      case 'date':
        return t('noCustomersFoundDate')
      case 'status':
        return t('noCustomersFoundStatus')
      default:
        return t('noCustomersFoundGeneral')
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        borderRadius: 3,
        backgroundColor: colors.neutral0,
        border: `2px solid ${colors.orange500}`,
        padding: 6,
        position: 'relative',
        boxShadow: `0 4px 20px ${colors.neutralShadow}`,
      }}
    >
      {/* Close button */}
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: colors.neutral500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: colors.blue600,
            transform: 'scale(1.1)',
          },
        }}
      >
        <XMarkIcon
          style={{
            width: '18px',
            height: '18px',
            color: colors.neutral0,
          }}
        />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: colors.orange10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <CustomTypography text='🔍' variant='h1' weight='regular' color={colors.orange500} />
      </Box>

      <CustomTypography text={getMessage()} variant='h2' weight='bold' color={colors.blue900} />
    </Box>
  )
}

export default NoResultsMessage
