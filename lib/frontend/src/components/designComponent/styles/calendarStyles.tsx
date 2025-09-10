import { styled, Box, IconButton, Button } from '@mui/material'
import { colors } from '../../../styles/theme'

// Common constants
export const STANDARD_GAP = '2px'
export const CALENDAR_FONT_FAMILY = 'Heebo, Arial, sans-serif'
export const CALENDAR_FONT_SIZE = '13px'

// Base flex components - reusable across the app
const FlexBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

// Calendar specific styled components
export const CalendarDayBase = styled(FlexBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5),
  justifyContent: 'center',
  cursor: 'pointer',
  outline: 'none',
  aspectRatio: 1,
  fontFamily: CALENDAR_FONT_FAMILY,
  fontSize: CALENDAR_FONT_SIZE,
  fontWeight: 400,
  transition: theme.transitions.create(['background-color', 'color', 'opacity', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:focus-visible': {
    outline: `2px solid ${colors.blueOverlay700}`,
    outlineOffset: 2,
  },

  '&:active': {
    transform: 'scale(0.95)',
  },
}))

// Common layout patterns
export const FlexRow = styled(FlexBase)({
  gap: STANDARD_GAP,
})

export const FlexRowSpaceBetween = styled(FlexBase)({
  justifyContent: 'space-between',
  width: '100%',
})

export const FlexColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})

export const FlexColumnWithGap = styled(FlexColumn)({
  gap: STANDARD_GAP,
})

// Calendar specific components
export const CalendarIconButton = styled(IconButton)({
  padding: '1px',
  '& svg': {
    width: 14,
    height: 14,
    color: colors.neutral900,
  },
})

export const CalendarContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '100%',
  padding: '8px 12px',
  background: colors.neutral0,
  borderRadius: '16px',
  outline: `1px solid ${colors.blueOverlay700}`,
  outlineOffset: '-1px',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: STANDARD_GAP,
  boxSizing: 'border-box',
})

// Calendar grid specific components
export const DayOfWeekHeader = styled(FlexBase)({
  justifyContent: 'space-between',
  paddingTop: '4px',
  paddingBottom: '4px',
  marginBottom: STANDARD_GAP,
})

export const DayOfWeekCell = styled(Box)({
  flex: '1 1 0',
  textAlign: 'center',
  padding: '2px 1px',
  fontSize: CALENDAR_FONT_SIZE,
  fontWeight: 400,
  color: colors.neutral900,
  fontFamily: CALENDAR_FONT_FAMILY,
  minWidth: '16px',
  maxWidth: '16px',
})

export const WeekRow = styled(FlexRowSpaceBetween)({
  margin: '1px 0',
})

// Calendar header components
export const CalendarHeaderContainer = styled(FlexRowSpaceBetween)({
  marginBottom: '4px',
  marginTop: '4px',
})

// Calendar button components
export const CalendarButtonContainer = styled(FlexRow)({
  marginTop: '6px',
  marginBottom: '4px',
  gap: '4px',
})

export const CalendarButton = styled(Button)<{ buttonvariant: 'apply' | 'clear' }>(
  ({ buttonvariant }) => ({
    minWidth: 'auto',
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: CALENDAR_FONT_FAMILY,
    borderRadius: '4px',
    textTransform: 'none',
    ...(buttonvariant === 'apply'
      ? {
          backgroundColor: colors.blue600,
          color: colors.neutral0,
          '&:hover': { backgroundColor: colors.blue800 },
          '&:disabled': { backgroundColor: colors.neutral300, color: colors.neutral600 },
        }
      : {
          backgroundColor: 'transparent',
          color: colors.neutral500,
          border: `1px solid ${colors.neutral500}`,
          '&:hover': { backgroundColor: colors.hoverGray },
        }),
  }),
)
