import React, { useState, useEffect } from 'react'
import { Box, Button, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CalendarHeaderComponent from './CalendarHeaderComponent'
import CalendarGrid from './CalendarGrid'
import { generateCalendarDays } from './calendarUtils'
import { colors } from '../../styles/theme'

interface InlineDateRangePickerProps {
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  placeholder?: string
  resetTrigger?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const CalendarContainer = styled(Box)({
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

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '4px',
  marginTop: '6px',
  marginBottom: '4px',
})

const StyledButton = styled(Button)<{ buttonvariant: 'apply' | 'clear' }>(({ buttonvariant }) => ({
  minWidth: 'auto',
  padding: '4px 8px',
  fontSize: '11px',
  fontFamily: 'Heebo, Arial, sans-serif',
  borderRadius: '4px',
  textTransform: 'none',
  ...(buttonvariant === 'apply' ? {
    backgroundColor: colors.c2,
    color: colors.c6,
    '&:hover': { backgroundColor: colors.c43 },
    '&:disabled': { backgroundColor: colors.c44, color: colors.c41 },
  } : {
    backgroundColor: 'transparent',
    color: colors.c42,
    border: `1px solid ${colors.c42}`,
    '&:hover': { backgroundColor: colors.c46 },
  }),
}))

const InlineDateRangePicker: React.FC<InlineDateRangePickerProps> = ({
  onDateRangeChange,
  resetTrigger = false,
  isOpen = false,
  onClose
}) => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingStart, setSelectingStart] = useState(true)

  useEffect(() => {
    if (resetTrigger) {
      setStartDate(null)
      setEndDate(null)
      setSelectingStart(true)
      onDateRangeChange(null, null)
    }
  }, [resetTrigger, onDateRangeChange])

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setStartDate(date)
      setEndDate(null)
      setSelectingStart(false)
    } else {
      if (startDate && date < startDate) {
        setStartDate(date)
        setEndDate(startDate)
      } else {
        setEndDate(date)
      }
      setSelectingStart(true)
    }
  }

  const handleApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      
      onDateRangeChange(start, end)
    }
    onClose?.()
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectingStart(true)
    onDateRangeChange(null, null)
    onClose?.()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const calendarDays = generateCalendarDays(currentMonth)
  const weeks = []
  
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  if (!isOpen) {
    return null
  }

  return (
    <CalendarContainer sx={{
      gridArea: '1 / 1',
      position: 'relative',
      zIndex: 10,
      marginTop: 0,
    }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <CalendarHeaderComponent
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <CalendarGrid
          weeks={weeks}
          currentMonth={currentMonth}
          startDate={startDate}
          endDate={endDate}
          onDateClick={handleDateClick}
        />

        <ButtonContainer>
          <StyledButton 
            buttonvariant="apply"
            onClick={handleApply}
            disabled={!startDate || !endDate}
          >
            {t('apply')}
          </StyledButton>
          <StyledButton 
            buttonvariant="clear"
            onClick={handleClear}
          >
            {t('clear')}
          </StyledButton>
        </ButtonContainer>
      </Box>
    </CalendarContainer>
  )
}

export default InlineDateRangePicker
