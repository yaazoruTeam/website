import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button } from '@mui/material'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'

interface FilterResetButtonProps {
  onReset: () => void
  disabled: boolean 
}

const FilterResetButton: React.FC<FilterResetButtonProps> = ({ onReset, disabled }) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        height: 100,
        zIndex: 1,
      }}
    >
      <Button
        onClick={onReset}
        disabled={disabled} 
        sx={{
          width: '50%',
          height: '50px',
          marginTop: 0,
          opacity: disabled ? 0.5 : 1,
          borderRadius: 4,
          outline: `1px solid ${colors.blueOverlay700}`,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Box sx={{ paddingTop: 1.2, alignItems: 'center' }}>
          <CustomTypography text={t('reset')} variant='h4' weight='regular' color={colors.blue900} />
        </Box>
      </Button>
    </Box>
  )
}

export default FilterResetButton
