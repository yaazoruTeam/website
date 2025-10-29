import React, { useState, useEffect, useRef } from 'react'
import { FormControl, Select, MenuItem, OutlinedInput } from '@mui/material'
import DateRangePickerComponent from '../designComponent/InlineDateRangePicker'
import { getCities } from '../../api/customerApi'
import CityOptions from '../designComponent/CityOptions'
import StatusCard from '../designComponent/StatusCard'
import {
  SelectContainer,
  SelectWrapper,
  CustomSearchSelectChevronDownIcon,
  CustomSearchSelectChevronLeftIcon,
  CustomSearchSelectCalendarIcon,
} from '../designComponent/styles/customersStyles'
import { colors } from '../../styles/theme'

interface CustomSearchSelectProps {
  placeholder?: string
  searchType: 'city' | 'date' | 'status' | 'other'
  onCitySelect?: (city: string) => void
  onDateRangeSelect?: (start: Date, end: Date) => void
  onStatusSelect?: (status: 'active' | 'inactive') => void
  SwitchboardSelect?: boolean
  resetTrigger?: boolean
}

const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
  placeholder,
  searchType,
  onCitySelect,
  onDateRangeSelect,
  onStatusSelect,
  SwitchboardSelect,
  resetTrigger,
}) => {
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const selectRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (searchType === 'city') {
      fetchCities()
    }
  }, [searchType])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (resetTrigger) {
      setSelectedCity('')
      setOpen(false)
    }
  }, [resetTrigger])

  const fetchCities = async () => {
    try {
      const cities: string[] = await getCities()
      setOptions(cities)
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleSelectClick = (event: React.SyntheticEvent<Element, Event>) => {
    if (event.currentTarget instanceof HTMLElement) {
      setOpen((prev) => !prev)
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setOpen(false)
    onCitySelect?.(city)
  }

  const handleDateRangeSelect = (start: Date | null, end: Date | null) => {
    setOpen(false)
    if (start && end) {
      onDateRangeSelect?.(start, end)
    }
  }

  const handleStatusSelect = async (status: 'active' | 'inactive') => {
    setOpen(false)
    onStatusSelect?.(status)
  }

  return (
    <SelectContainer ref={selectRef}>
      <SelectWrapper>
        <FormControl fullWidth>
          <Select
            open={false}
            value={selectedCity}
            displayEmpty
            onOpen={handleSelectClick}
            renderValue={(selected) => (selected ? selected : placeholder)}
            sx={{
              backgroundColor: colors.neutral75,
              border: `1px solid ${colors.blueOverlay700}`,
              borderRadius: SwitchboardSelect ? 1 : 4,
              '& fieldset': { border: 'none' },
              '& .MuiSelect-icon': {
                display: 'none',
              },
            }}
            input={<OutlinedInput />}
            endAdornment={
              searchType === 'city' || searchType === 'status' || searchType === 'other' ? (
                open ? (
                  <CustomSearchSelectChevronDownIcon />
                ) : (
                  <CustomSearchSelectChevronLeftIcon />
                )
              ) : (
                <CustomSearchSelectCalendarIcon />
              )
            }
          >
            <MenuItem value='' disabled>
              {placeholder}
            </MenuItem>
          </Select>
        </FormControl>
      </SelectWrapper>
      {searchType === 'city' && open && (
        <CityOptions cities={options} onCitySelect={handleCitySelect} />
      )}
      {searchType === 'status' && open && <StatusCard onStatusSelect={handleStatusSelect} />}
      {searchType === 'date' && open && (
        <DateRangePickerComponent
          onDateRangeChange={handleDateRangeSelect}
          resetTrigger={resetTrigger}
          placeholder={placeholder}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </SelectContainer>
  )
}

export default CustomSearchSelect
