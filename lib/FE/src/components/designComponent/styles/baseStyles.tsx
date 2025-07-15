import { styled, Box } from '@mui/material'

// Base reusable styled components
export const FlexBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

export const FlexRow = styled(FlexBase)({})

export const FlexRowSpaceBetween = styled(FlexBase)({
  justifyContent: 'space-between',
  width: '100%',
})

export const FlexColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})
