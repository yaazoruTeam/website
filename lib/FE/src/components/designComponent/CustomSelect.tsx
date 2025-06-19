import React, { useState } from 'react'
import { FormControl, Select, MenuItem, InputAdornment, Box } from '@mui/material'
import { Controller } from 'react-hook-form'
import { colors } from '../../styles/theme'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import CustomTypography from './Typography'

interface CustomSelectProps {
  name: string
  control: any
  options: { label: string; value: string; icon?: React.ReactNode }[]
  label: string
  variant?: 'default' | 'changeAccount'
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  control,
  options,
  label,
  variant = 'default',
}) => {
  const [open, setOpen] = useState(false)

  const handleIconClick = () => {
    setOpen((prevState) => !prevState)
  }

  return (
    <FormControl sx={{ width: '100%' }}>
      <CustomTypography
        text={label}
        variant='h4'
        weight='regular'
        color={colors.c11}
        sx={{ marginBottom: '5px' }}
      />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderValue={(selected) => {
              const selectedOption = options.find((opt) => opt.value === selected)
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CustomTypography
                    text={selectedOption?.label || ''}
                    variant='h4'
                    weight='regular'
                    color={colors.c11}
                  />
                  {selectedOption?.icon && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '300px',
                      }}
                    >
                      {selectedOption?.icon}
                    </Box>
                  )}
                </Box>
              )
            }}
            sx={{
              textAlign: 'right',
              backgroundColor: colors.feild,
              border: 'none',
              boxShadow: 'none',
              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-icon': {
                display: 'none',
              },
              width: '100%',
              height: '44px',
              padding: '0 10px',
              '& .MuiSelect-root': {
                paddingLeft: '30px',
              },
            }}
            value={field.value || ''}
            endAdornment={
              <InputAdornment position='end' onClick={handleIconClick}>
                <ChevronDownIcon style={{ width: '21.5px', height: '16px', color: colors.c2 }} />
              </InputAdornment>
            }
            MenuProps={
              variant === 'changeAccount'
                ? {
                    PaperProps: {
                      sx: {
                        outline: `1px solid ${colors.c22}`,
                        mt: '4px',
                      },
                    },
                  }
                : {}
            }
          >
            {variant === 'changeAccount'
              ? options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    selected={field.value === option.value}
                    sx={{
                      direction: 'rtl',
                      marginLeft: '2%',
                      marginRight: '2%',
                      p: 2,
                      backgroundColor:
                        field.value === option.value ? 'rgba(229, 241, 255, 0.70)' : 'white',
                      borderRadius: 3,
                      flexDirection: 'row-reverse',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(229, 241, 255, 0.5)',
                      },
                    }}
                  >
                    <div style={{ textAlign: 'right', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CustomTypography
                          text={option.label}
                          variant='h4'
                          weight='regular'
                          color={colors.c11}
                        />
                        {option.icon && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              marginRight: '350px',
                            }}
                          >
                            {option.icon}
                          </Box>
                        )}
                      </Box>
                    </div>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: field.value === option.value ? colors.c2 : 'transparent',
                        border:
                          field.value === option.value
                            ? 'none'
                            : '0.67px solid rgba(21.45, 53.71, 70.41, 0.37)',
                        marginLeft: '12px',
                      }}
                    />
                  </MenuItem>
                ))
              : options.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ direction: 'rtl' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CustomTypography
                        text={option.label}
                        variant='h4'
                        weight='regular'
                        color={colors.c11}
                      />
                      {option.icon && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '350px',
                          }}
                        >
                          {option.icon}
                        </Box>
                      )}
                    </Box>
                  </MenuItem>
                ))}
          </Select>
        )}
      />
    </FormControl>
  )
}

export default CustomSelect
