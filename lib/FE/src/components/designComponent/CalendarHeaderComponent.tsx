import React from 'react'
import { Box, IconButton } from '@mui/material'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'

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
        <CustomTypography
          text={currentMonth.getFullYear().toString()}
          variant="h5"
          weight="regular"
          color={colors.c40}
        />
        <CustomTypography
          text={getMonthName(currentMonth.getMonth())}
          variant="h5"
          weight="regular"
          color={colors.c40}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: '2px' }}>
        <IconButton onClick={onPrevMonth} size="small" sx={{ padding: '1px' }}>
          <ChevronRightIcon style={{ width: 14, height: 14, color: colors.c40 }} />
        </IconButton>
        <IconButton onClick={onNextMonth} size="small" sx={{ padding: '1px' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14, color: colors.c40 }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CalendarHeaderComponent
