import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

interface CalendarHeaderComponentProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

const CalendarHeaderComponent: React.FC<CalendarHeaderComponentProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth
}) => {
  const { t } = useTranslation()
  
  const getMonthName = (monthIndex: number): string => {
    const monthKeys = [
      'months.january', 'months.february', 'months.march', 'months.april',
      'months.may', 'months.june', 'months.july', 'months.august',
      'months.september', 'months.october', 'months.november', 'months.december'
    ]
    return t(monthKeys[monthIndex])
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '4px',
      marginTop: '4px',
    }}>
      <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        <Typography sx={{ 
          color: '#121212', 
          fontSize: '13px', 
          fontFamily: 'Heebo, Arial, sans-serif', 
          fontWeight: 400 
        }}>
          {currentMonth.getFullYear()}
        </Typography>
        <Typography sx={{ 
          color: '#121212', 
          fontSize: '13px', 
          fontFamily: 'Heebo, Arial, sans-serif', 
          fontWeight: 400 
        }}>
          {getMonthName(currentMonth.getMonth())}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '2px' }}>
        <IconButton onClick={onPrevMonth} size="small" sx={{ padding: '1px' }}>
          <ChevronRightIcon style={{ width: 14, height: 14, color: '#121212' }} />
        </IconButton>
        <IconButton onClick={onNextMonth} size="small" sx={{ padding: '1px' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14, color: '#121212' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CalendarHeaderComponent
