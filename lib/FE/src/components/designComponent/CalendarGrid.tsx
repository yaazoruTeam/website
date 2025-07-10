import React from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CalendarDay from './CalendarDay'
import { colors } from '../../styles/theme'
import { DayOfWeekHeader, DayOfWeekCell, WeekRow, FlexColumnWithGap } from './CalendarStyles'

interface CalendarGridProps {
  weeks: Date[][]
  currentMonth: Date
  startDate: Date | null
  endDate: Date | null
  onDateClick: (date: Date) => void
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  weeks,
  currentMonth,
  startDate,
  endDate,
  onDateClick,
}) => {
  const { t } = useTranslation()

  const getDayNames = (): string[] => {
    return [
      t('days.sunday'),
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday'),
      t('days.saturday'),
    ]
  }

  const isDateSelected = (date: Date): boolean => {
    if (!startDate && !endDate) return false
    return Boolean(
      (startDate && date.getTime() === startDate.getTime()) ||
        (endDate && date.getTime() === endDate.getTime()),
    )
  }

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false
    return date >= startDate && date <= endDate
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <Box>
      <DayOfWeekHeader>
        {getDayNames().map((day, index) => (
          <DayOfWeekCell
            key={index}
            sx={{
              color: index === 6 ? colors.c2 : colors.c40,
            }}
          >
            {day}
          </DayOfWeekCell>
        ))}
      </DayOfWeekHeader>

      <FlexColumnWithGap sx={{ marginTop: '5px' }}>
        {weeks.map((week, weekIndex) => (
          <WeekRow key={weekIndex}>
            {week.map((date, dayIndex) => (
              <CalendarDay
                key={`${weekIndex}-${dayIndex}`}
                date={date}
                currentMonth={currentMonth}
                isSelected={isDateSelected(date)}
                isInRange={isDateInRange(date)}
                isToday={isToday(date)}
                onClick={onDateClick}
              />
            ))}
          </WeekRow>
        ))}
      </FlexColumnWithGap>
    </Box>
  )
}

export default CalendarGrid
