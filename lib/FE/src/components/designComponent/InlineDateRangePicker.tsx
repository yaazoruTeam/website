import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CalendarHeaderComponent from './CalendarHeaderComponent'
import CalendarGrid from './CalendarGrid'
import { generateCalendarDays } from './calendarUtils'
import { CalendarContainer, FlexColumnWithGap, CalendarButtonContainer, CalendarButton } from './CalendarStyles'

interface InlineDateRangePickerProps {
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  placeholder?: string
  resetTrigger?: boolean
  isOpen?: boolean
  onClose?: () => void
}

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
      <FlexColumnWithGap sx={{ width: '100%' }}>
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

        <CalendarButtonContainer>
          <CalendarButton 
            buttonvariant="apply"
            onClick={handleApply}
            disabled={!startDate || !endDate}
          >
            {t('apply')}
          </CalendarButton>
          <CalendarButton 
            buttonvariant="clear"
            onClick={handleClear}
          >
            {t('clear')}
          </CalendarButton>
        </CalendarButtonContainer>
      </FlexColumnWithGap>
    </CalendarContainer>
  )
}

export default InlineDateRangePicker
