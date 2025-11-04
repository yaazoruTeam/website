import React from 'react'
import { Box } from '@mui/material'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'

interface ImeiDetailsModalProps {
  open: boolean
  onClose: () => void
  imeiFromDatabase: string
  imeiFromSim?: string
  serialNumber?: string
}

const ImeiDetailsModal: React.FC<ImeiDetailsModalProps> = ({
  open,
  onClose,
  imeiFromDatabase,
  imeiFromSim,
  serialNumber,
}) => {
  const { t } = useTranslation()

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomTypography
        text={t('imeiDetails')}
        variant="h1"
        weight="medium"
        color={colors.blue900}
        sx={{ marginBottom: 3 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* IMEI from Database */}
        <Box>
          <CustomTypography
            text={t('imeiFromDatabase')}
            variant="h4"
            weight="medium"
            color={colors.blue700}
            sx={{ marginBottom: 1 }}
          />
          <CustomTypography
            text={imeiFromDatabase || t('dataNotAvailable')}
            variant="h3"
            weight="bold"
            color={colors.blue900}
          />
        </Box>

        {/* IMEI from SIM (Widely) */}
        <Box>
          <CustomTypography
            text={t('imeiFromSim')}
            variant="h4"
            weight="medium"
            color={colors.blue700}
            sx={{ marginBottom: 1 }}
          />
          <CustomTypography
            text={imeiFromSim || t('dataNotAvailable')}
            variant="h3"
            weight="bold"
            color={colors.blue900}
          />
        </Box>

        {/* Serial Number (Samsung) */}
        <Box>
          <CustomTypography
            text={t('imeiFromSamsung')}
            variant="h4"
            weight="medium"
            color={colors.blue700}
            sx={{ marginBottom: 1 }}
          />
          <CustomTypography
            text={serialNumber || t('dataNotAvailable')}
            variant="h3"
            weight="bold"
            color={colors.blue900}
          />
        </Box>
      </Box>
    </CustomModal>
  )
}

export default ImeiDetailsModal
