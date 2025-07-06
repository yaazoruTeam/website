import React from 'react'
import { styled, Box } from '@mui/material'

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
  backgroundColor: isSelected ? '#FF7F07' : isInRange ? 'rgba(255, 127, 7, 0.1)' : 'transparent',
  color: isSelected ? 'white' : 
         isToday ? '#FF7F07' : 
         isOtherMonth ? '#858585' : 
         isHoliday ? '#0A425F' : '#858585',
  border: isToday && !isSelected ? '1px solid #FF7F07' : 'none',
  '&:hover': {
    backgroundColor: isSelected ? '#FF7F07' : 'rgba(255, 127, 7, 0.1)',
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
