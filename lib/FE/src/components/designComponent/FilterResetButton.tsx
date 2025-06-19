import React from 'react'
import { Box, Button } from '@mui/material'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'

interface FilterResetButtonProps {
  onReset: () => void
}

const FilterResetButton: React.FC<FilterResetButtonProps> = ({ onReset }) => {
  return (
    <Box
      sx={{
        height: 100,
        zIndex: 1,
      }}
    >
      <Button
        onClick={onReset}
        sx={{
          width: '50%',
          height: '50px',
          marginTop: 0,
          opacity: 0.5,
          borderRadius: 4,
          outline: `1px solid ${colors.c22}`,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Box sx={{ paddingTop: 1.2, alignItems: 'center' }}>
          <CustomTypography text='אפס סינון' variant='h4' weight='regular' color={colors.c11} />
        </Box>
      </Button>
    </Box>
  )
}

export default FilterResetButton
