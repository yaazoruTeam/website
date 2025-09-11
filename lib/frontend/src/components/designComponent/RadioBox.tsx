import React, { ReactElement } from 'react'
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { colors } from '../../styles/theme'
export interface RadioBoxProps {
  options: { value: string; label: ReactElement | string }[]
  value: string
  onChange: (value: string) => void
}

const CustomRadioBox: React.FC<RadioBoxProps> = ({ options, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const noMarginPaddingStyles = { margin: 0, padding: 0, ml: 0, pl: 0 }

  return (
    <FormControl sx={noMarginPaddingStyles}>
      <RadioGroup value={value} onChange={handleChange} row sx={noMarginPaddingStyles}>
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  disableRipple
                  icon={
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: `1px solid ${colors.blueOverlay650}`,
                        background: 'transparent',
                      }}
                    />
                  }
                  checkedIcon={
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: colors.blue600,
                      }}
                    />
                  }
                  checked={isSelected}
                />
              }
              label={option.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '16px',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                background: 'transparent',
                transition: 'background 0.2s ease-in-out',
                m: 0,
                '&:first-of-type': {
                  marginLeft: 0
                }
              }}
            />
          )
        })}
      </RadioGroup>
    </FormControl>
  )
}

export default CustomRadioBox
