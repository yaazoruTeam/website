import React, { useState, useRef } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import DateRangePickerComponent from '../components/designComponent/DateRangeSelector'
import { Button } from '@mui/material'

const meta: Meta<typeof DateRangePickerComponent> = {
  title: 'Components/DateRangePickerComponent',
  component: DateRangePickerComponent,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof DateRangePickerComponent>

export const Default: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [selectedRange, setSelectedRange] = useState<string>('לא נבחר טווח תאריכים')
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleOpen = () => {
      if (buttonRef.current) {
        setAnchorEl(buttonRef.current)
      }
    }

    const handleClose = () => {
      setAnchorEl(null)
    }

    const handleSelectRange = (startDate: Date, endDate: Date) => {
      // המרה לאובייקטים של Date
      const start = new Date(startDate)
      const end = new Date(endDate)

      setSelectedRange(`${start.toLocaleDateString('he-IL')} - ${end.toLocaleDateString('he-IL')}`)
    }

    return (
      <div style={{ direction: 'rtl', fontFamily: 'Heebo' }}>
        <Button variant='contained' color='primary' onClick={handleOpen} ref={buttonRef}>
          בחר טווח תאריכים
        </Button>
        <p style={{ marginTop: '20px' }}>{selectedRange}</p>
        <DateRangePickerComponent
          anchorEl={anchorEl}
          onClose={handleClose}
          onDateRangeSelect={handleSelectRange}
        />
      </div>
    )
  },
}
