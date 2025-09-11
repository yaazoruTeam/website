import React from 'react'
import { Button, Box } from '@mui/material'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'

interface CountryButtonProps {
  countryName: string
  flagSrc: string
  selected: boolean
  onClick?: () => void
}

const CountryButton: React.FC<CountryButtonProps> = ({
  countryName,
  flagSrc,
  selected,
  onClick,
}) => {
  return (
    <Button
      variant='outlined'
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        padding: '10px 12px',
        textTransform: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        direction: 'rtl',
        justifyContent: 'flex-start',
        background: selected ? colors.blueOverlay100 : 'transparent',
        outline: selected ? `1px solid ${colors.blue100}` : 'none',
        outlineOffset: selected ? '-1px' : undefined,
        borderColor: selected ? colors.blue100 : colors.neutral150,
        color: colors.blue900,
        fontWeight: 400,
        fontSize: '14px',
        fontFamily: 'Heebo',
      }}
    >
      <Box
        component='img'
        src={flagSrc}
        alt={`דגל ${countryName}`}
        sx={{ width: 20, height: 14, objectFit: 'cover' }}
      />
      <CustomTypography
        text={countryName}
        weight='regular'
        variant='h5'
        color={colors.blue900}
        sx={{ fontSize: '14px' }}
      />
    </Button>
  )
}

export default CountryButton
