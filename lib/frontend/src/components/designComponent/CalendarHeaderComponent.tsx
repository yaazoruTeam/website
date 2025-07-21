import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'
import { CalendarHeaderContainer, FlexRow, CalendarIconButton } from './styles/calendarStyles'

interface CalendarHeaderComponentProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

const CalendarHeaderComponent: React.FC<CalendarHeaderComponentProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  const { t } = useTranslation()

  const getMonthName = (monthIndex: number): string => {
    const monthKeys = [
      'months.january',
      'months.february',
      'months.march',
      'months.april',
      'months.may',
      'months.june',
      'months.july',
      'months.august',
      'months.september',
      'months.october',
      'months.november',
      'months.december',
    ]
    return t(monthKeys[monthIndex])
  }

  return (
    <CalendarHeaderContainer>
      <FlexRow>
        <CustomTypography
          text={currentMonth.getFullYear().toString()}
          variant='h5'
          weight='regular'
          color={colors.c40}
        />
        <CustomTypography
          text={getMonthName(currentMonth.getMonth())}
          variant='h5'
          weight='regular'
          color={colors.c40}
        />
      </FlexRow>
      <FlexRow>
        <CalendarIconButton onClick={onPrevMonth} size='small'>
          <ChevronRightIcon />
        </CalendarIconButton>
        <CalendarIconButton onClick={onNextMonth} size='small'>
          <ChevronLeftIcon />
        </CalendarIconButton>
      </FlexRow>
    </CalendarHeaderContainer>
  )
}

export default CalendarHeaderComponent
