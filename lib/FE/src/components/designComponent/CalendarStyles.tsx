import { styled, Box, IconButton } from '@mui/material'
import { colors } from '../../styles/theme'

// Base flex components - reusable across the app
const FlexBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

// Calendar specific styled components
export const CalendarDayBase = styled(FlexBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  outline: 'none',
  aspectRatio: 1,
  minHeight: 32,
  minWidth: 32,
  fontFamily: 'Heebo, Arial, sans-serif',
  fontSize: '13px',
  fontWeight: 400,
  transition: theme.transitions.create(['background-color', 'color', 'opacity', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:focus-visible': {
    outline: `2px solid ${colors.c22}`,
    outlineOffset: 2,
  },

  '&:active': {
    transform: 'scale(0.95)',
  },
}))

// Common layout patterns
export const FlexRow = styled(FlexBase)({
  gap: '2px',
})

export const FlexRowSpaceBetween = styled(FlexBase)({
  justifyContent: 'space-between',
  width: '100%',
})

export const FlexColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})

export const FlexColumnWithGap = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

// Calendar specific components
export const CalendarIconButton = styled(IconButton)({
  padding: '1px',
  '& svg': {
    width: 14,
    height: 14,
    color: colors.c40,
  },
})

export const CalendarContainer = styled(Box)({
  width: '100%',
  maxWidth: '100%',
  padding: '8px 12px',
  background: colors.c6,
  borderRadius: '16px',
  outline: `1px solid ${colors.c22}`,
  outlineOffset: '-1px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '2px',
  boxSizing: 'border-box',
})

// Calendar grid specific components
export const DayOfWeekHeader = styled(FlexBase)({
  justifyContent: 'space-between',
  paddingTop: '4px',
  paddingBottom: '4px',
  marginBottom: '2px',
})

export const DayOfWeekCell = styled(Box)({
  flex: '1 1 0',
  textAlign: 'center',
  padding: '2px 1px',
  fontSize: '13px',
  fontWeight: 400,
  color: colors.c40,
  fontFamily: 'Heebo, Arial, sans-serif',
  minWidth: '16px',
  maxWidth: '16px',
})

export const WeekRow = styled(FlexBase)({
  justifyContent: 'space-between',
  margin: '1px 0',
  width: '100%',
})

// Calendar header components
export const CalendarHeaderContainer = styled(FlexBase)({
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '4px',
  marginTop: '4px',
})

// Using FlexRow for both date and buttons containers since they're identical
