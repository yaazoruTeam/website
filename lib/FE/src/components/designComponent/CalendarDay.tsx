import React from 'react'
import { colors } from '../../styles/theme'

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
  onClick
}) => {
  const isOtherMonth = date.getMonth() !== currentMonth.getMonth()
  const isHoliday = date.getDay() === 6

  return (
    <div
      className={`
        flex-1 p-1
        flex justify-center items-center
        cursor-pointer
        transition-all duration-200
        border-none
        aspect-square
        min-h-8 min-w-8
        ${isSelected ? 'rounded-full' : 'rounded-none'}
        hover:opacity-80
      `}
      style={{
        fontFamily: 'Heebo',
        fontSize: '13px',
        backgroundColor: isSelected ? colors.c3 : isInRange ? colors.c45 : 'transparent',
        color: isSelected ? colors.c6 : 
               isToday ? colors.c3 : 
               isOtherMonth ? colors.c42 : 
               isHoliday ? colors.c2 : 
               colors.c42,
        border: isToday && !isSelected ? `1px solid ${colors.c3}` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = colors.c45
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = isInRange ? colors.c45 : 'transparent'
        }
      }}
      onClick={() => onClick(date)}
    >
      {date.getDate()}
    </div>
  )
}

export default CalendarDay
