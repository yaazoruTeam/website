import { styled } from '@mui/material'
import { colors } from '../../../styles/theme'
import { FlexBase } from './baseStyles'

// Widely specific styled components - מתומצת וקצר
export const WidelyContainer = styled('div')({
  padding: '24px',
  direction: 'rtl',
  background: colors.c6,
})

export const WidelyHeaderSection = styled(FlexBase)({
  gap: '4px',
  marginBottom: '40px',
  justifyContent: 'space-between',
})

export const WidelyFormSection = styled(FlexBase)({
  gap: '16px', 
  marginBottom: '40px',
})

export const WidelyConnectionSection = styled('div')({
  marginBottom: '40px',
  '& > div:first-of-type': { marginBottom: '16px' },
  '& > div:last-child': { marginLeft: '-16px' },
})

export const WidelyInfoSection = styled(FlexBase)({
  justifyContent: 'space-between',
  margin: '40px 0',
})
