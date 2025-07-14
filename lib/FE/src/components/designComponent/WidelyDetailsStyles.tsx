import { styled, Box } from '@mui/material'
import { colors } from '../../styles/theme'

// Common constants for WidelyDetails component
export const WIDELY_STANDARD_GAP = '40px'
export const WIDELY_SMALL_GAP = '16px'

// Base styled components following the pattern from CalendarStyles
const FlexBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

// Widely Details specific styled components
export const WidelyContainer = styled(Box)({
  padding: '24px',
  direction: 'rtl',
  background: colors.c6,
})

export const WidelySection = styled(FlexBase)({
  marginBottom: WIDELY_STANDARD_GAP,
})

export const WidelyHeaderSection = styled(WidelySection)({
  gap: '4px', // 1 * 4px = 4px (gap: 1 in Material-UI)
})

export const WidelyFormSection = styled(WidelySection)({
  gap: '16px', // 2 * 8px = 16px (gap: 2 in Material-UI)
})

export const WidelyConnectionSection = styled(Box)({
  marginBottom: WIDELY_STANDARD_GAP,
  '& > div:first-of-type': {
    marginBottom: WIDELY_SMALL_GAP,
  },
  '& > div:last-child': {
    marginLeft: '-16px',
  },
})

export const WidelyInfoSection = styled(FlexBase)({
  justifyContent: 'space-between',
  margin: `${WIDELY_STANDARD_GAP} 0`,
})
