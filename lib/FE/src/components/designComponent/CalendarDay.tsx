import React from 'react'
import { styled, Box } from '@mui/material'
import { colors } from '../../styles/theme'

const DayCell = styled(Box)<{ 
  isSelected?: boolean; 
  isInRange?: boolean; 
  isToday?: boolean; 
  isOtherMonth?: boolean;
  isHoliday?: boolean;
}>(({ isSelected, isInRange, isToday, isOtherMonth, isHoliday }) => ({
  flex: '1 1 0',
  height: '15px',
  minWidth: '16px',
  maxWidth: '16px',
  padding: '2px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '10px',
  fontWeight: 400,
  fontFamily: 'Heebo, Arial, sans-serif',
  cursor: 'pointer',
  borderRadius: isSelected ? '50%' : '0',
  backgroundColor: isSelected ? colors.c3 : isInRange ? colors.c45 : 'transparent',
  color: isSelected ? colors.c6 : 
         isToday ? colors.c3 : 
         isOtherMonth ? colors.c42 : 
         isHoliday ? colors.c2 : colors.c42,
  border: isToday && !isSelected ? `1px solid ${colors.c3}` : 'none',
  '&:hover': {
    backgroundColor: isSelected ? colors.c3 : colors.c45,
  },
}))

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
    <DayCell
      isSelected={isSelected}
      isInRange={isInRange}
      isToday={isToday}
      isOtherMonth={isOtherMonth}
      isHoliday={isHoliday}
      onClick={() => onClick(date)}
    >
      {date.getDate()}
    </DayCell>
  )
}

export default CalendarDay
