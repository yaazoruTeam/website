import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

interface CustomCalendarProps {
  currentDate: Date
  selectedDate: Date | null
  startDate: Date | null
  endDate: Date | null
  onDateSelect: (date: Date) => void
  onMonthChange: (direction: 'prev' | 'next') => void
  isInRange?: (date: Date) => boolean
  isToday?: (date: Date) => boolean
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  isInRange,
  isToday,
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

  const getDayNames = (): string[] => {
    return [
      t('days.sunday'), t('days.monday'), t('days.tuesday'), t('days.wednesday'),
      t('days.thursday'), t('days.friday'), t('days.saturday')
    ]
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    
    const startDayOfWeek = firstDay.getDay()
    startDate.setDate(startDate.getDate() - startDayOfWeek)

    const days = []
    const totalDays = 42
    for (let i = 0; i < totalDays; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  const currentMonth = getMonthName(currentDate.getMonth())
  const currentYear = currentDate.getFullYear()
  const dayNames = getDayNames()

  const handleDateClick = (date: Date) => {
    onDateSelect(date)
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: 2.5,
        background: 'white',
        borderRadius: '8px',
        border: '1px solid rgba(11.47, 57.77, 81.74, 0.36)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        fontFamily: 'Heebo, sans-serif',
      }}
    >
      <Box
        sx={{
          width: 173,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            alignSelf: 'stretch',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => onMonthChange('prev')}
              sx={{
                width: 20,
                height: 20,
                padding: 0,
                color: '#121212',
                overflow: 'hidden',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
            >
              <ChevronRightIcon style={{ fontSize: 14 }} />
            </IconButton>
            <IconButton
              onClick={() => onMonthChange('next')}
              sx={{
                width: 20,
                height: 20,
                padding: 0,
                color: '#121212',
                overflow: 'hidden',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
            >
              <ChevronLeftIcon style={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Month and year */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Typography
              sx={{
                color: '#121212',
                fontSize: 16,
                fontFamily: 'Heebo',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              {currentMonth}
            </Typography>
            <Typography
              sx={{
                color: '#121212',
                fontSize: 16,
                fontFamily: 'Heebo',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              {currentYear}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {/* Day headers */}
          <Box
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
            }}
          >
            {dayNames.map((day, index) => (
              <Box
                key={day}
                sx={{
                  flex: '1 1 0',
                  paddingLeft: 0.25,
                  paddingRight: 0.25,
                  paddingTop: 1,
                  paddingBottom: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    width: 28,
                    textAlign: 'center',
                    color: index === 0 || index === 6 ? '#0A425F' : '#121212',
                    fontSize: 14,
                    fontFamily: 'Heebo',
                    fontWeight: 400,
                    wordWrap: 'break-word',
                  }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <Box
                key={weekIndex}
                sx={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date) => {
                  const isCurrentMonthDay = isCurrentMonth(date)
                  const isSelected = isSameDay(date, selectedDate)
                  const isInDateRange = isInRange?.(date)
                  const isTodayDay = isToday?.(date)

                  return (
                    <Box
                      key={date.toISOString()}
                      onClick={() => isCurrentMonthDay && handleDateClick(date)}
                      sx={{
                        flex: '1 1 0',
                        height: isTodayDay ? 24 : 32,
                        padding: 1,
                        cursor: isCurrentMonthDay ? 'pointer' : 'default',
                        borderRadius: isTodayDay ? 125 : 0,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: isSelected
                          ? '#FF7F07'
                          : isInDateRange
                          ? 'rgba(255, 127, 7, 0.1)'
                          : 'transparent',
                        border: isTodayDay ? '1px solid #FF7F07' : 'none',
                        '&:hover': {
                          backgroundColor: isCurrentMonthDay
                            ? isSelected
                              ? '#FF7F07'
                              : 'rgba(0,0,0,0.04)'
                            : 'transparent',
                        },
                      }}
                    >
                      {!isCurrentMonthDay ? null : (
                        <Typography
                          sx={{
                            textAlign: 'center',
                            color: isTodayDay ? '#FF7F07' : isSelected ? 'white' : '#858585',
                            fontSize: 14,
                            fontFamily: 'Heebo',
                            fontWeight: 400,
                            wordWrap: 'break-word',
                          }}
                        >
                          {date.getDate()}
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomCalendar
