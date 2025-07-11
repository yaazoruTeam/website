import React, { useState, useEffect, useRef } from 'react'
import { FormControl, Select, MenuItem, Box /*, InputBase*/, OutlinedInput } from '@mui/material'
import CityOptions from '../designComponent/CityOptions'
import DateRangePickerComponent from '../designComponent/DateRangeSelector'
import StatusCard from '../designComponent/StatusCard'
import { ChevronDownIcon, ChevronLeftIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { colors } from '../../styles/theme'
import { getCities } from '../../api/customerApi'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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
      setOpen(false) // סוגר את ה-dropdown כחלק מה-reset
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
      setAnchorEl(event.currentTarget)
      setOpen((prev) => !prev)
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setOpen(false)
    onCitySelect?.(city)
  }

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setOpen(false)
    onDateRangeSelect?.(start, end)
  }

  const handleStatusSelect = async (status: 'active' | 'inactive') => {
    setOpen(false)
    onStatusSelect?.(status)
  }

  return (
    <Box
      ref={selectRef}
      sx={{
        width: 100,
        height: 100,
        display: 'grid',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          gridArea: '1 / 1',
          width: '100%',
          height: '100%',
        }}
      >
        <FormControl fullWidth>
          <Select
            open={false}
            value={selectedCity}
            displayEmpty
            onOpen={handleSelectClick}
            renderValue={(selected) => (selected ? selected : placeholder)}
            sx={{
              backgroundColor: colors.c15,
              border: `1px solid ${colors.c22}`,
              borderRadius: SwitchboardSelect ? 1 : 4,
              width: '200px',
              height: '50px',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              '& fieldset': { border: 'none' },
              textAlign: 'right',
              justifyContent: 'flex-end',
              position: 'relative',
              '& .MuiSelect-icon': {
                display: 'none',
              },
              zIndex: 5,
            }}
            input={<OutlinedInput />}
            endAdornment={
              searchType === 'city' || searchType === 'status' || searchType === 'other' ? (
                open ? (
                  <ChevronDownIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: colors.c11,
                      position: 'absolute',
                      top: 16,
                      left: '10px',
                    }}
                  />
                ) : (
                  <ChevronLeftIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: colors.c11,
                      position: 'absolute',
                      top: 16,
                      left: '10px',
                    }}
                  />
                )
              ) : (
                <CalendarIcon
                  style={{
                    width: '16px',
                    height: '16px',
                    color: colors.c11,
                    position: 'absolute',
                    top: 16,
                    left: '10px',
                  }}
                />
              )
            }
          >
            <MenuItem value='' disabled>
              {placeholder}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      {searchType === 'city' && open && (
        <CityOptions cities={options} onCitySelect={handleCitySelect} />
      )}
      {searchType === 'status' && open && <StatusCard onStatusSelect={handleStatusSelect} />}
      {searchType === 'date' && open && (
        <DateRangePickerComponent
          anchorEl={anchorEl}
          onDateRangeSelect={handleDateRangeSelect}
          onClose={() => setOpen(false)}
        />
      )}
    </Box>
  )
}

export default CustomSearchSelect
