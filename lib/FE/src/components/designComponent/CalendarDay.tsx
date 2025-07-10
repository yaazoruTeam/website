import React from 'react'
import { colors } from '../../styles/theme'
import { CalendarDayBase } from './CalendarStyles'

interface CalendarDayProps {
  date: Date
  currentMonth: Date
  isSelected: boolean
  isInRange: boolean
  isToday: boolean
  onClick: (date: Date) => void
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  isSelected,
  isInRange,
  isToday,
  onClick,
}) => {
  const isOtherMonth = date.getMonth() !== currentMonth.getMonth()
  const isHoliday = date.getDay() === 6

  return (
    <CalendarDayBase
      role='gridcell'
      tabIndex={0}
      aria-label={`${date.getDate()} ${date.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}`}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
      onClick={() => onClick(date)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(date)
        }
      }}
      sx={{
        // Only dynamic styles here - base styles are in CalendarDayBase
        borderRadius: isSelected ? '50%' : 0,
        backgroundColor: isSelected ? colors.c3 : isInRange ? colors.c45 : 'transparent',

        color: isSelected
          ? colors.c6
          : isToday
            ? colors.c3
            : isOtherMonth
              ? colors.c42
              : isHoliday
                ? colors.c2
                : colors.c42,

        border: isToday && !isSelected ? `1px solid ${colors.c3}` : 'none',

        opacity: isOtherMonth ? 0.5 : 1,

        '&:hover': {
          opacity: 0.8,
          backgroundColor: !isSelected ? colors.c45 : colors.c3,
        },
      }}
    >
      {date.getDate()}
    </CalendarDayBase>
  )
}

export default CalendarDay
