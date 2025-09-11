import React from 'react'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from '../../styles/theme'

interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  variant?: 'default' | 'modern'
  disabled?: boolean
}

const StyledSwitch = styled(Switch)<{ variant?: 'default' | 'modern' }>(({ variant = 'default' }) => ({
  width: 44,
  height: 22,
  padding: 0,
  display: 'flex',
  transition: 'opacity 0.3s ease',
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: colors.neutral0,
      '& .MuiSwitch-thumb': {
        backgroundColor: variant === 'modern' ? colors.neutral0 : colors.green500,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: variant === 'modern' ? colors.orange500 : colors.neutral100,
        opacity: 1,
      },
    },
    '&:not(.Mui-checked)': {
      transform: 'translateX(0px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: variant === 'modern' ? colors.neutral0 : colors.red500,
      },
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      '& .MuiSwitch-thumb': {
        backgroundColor: colors.neutral350, // neutral gray
      },
      '& + .MuiSwitch-track': {
        backgroundColor: colors.neutral200, // neutral light gray
        opacity: 0.7,
      },
    },
  },
  '&:focus .MuiSwitch-thumb': {
    outline: 'none',
    boxShadow: 'none',
  },
  '& .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    borderRadius: 9999,
    boxShadow: 'none',
    outline: 'none',
  },
  '& .MuiSwitch-track': {
    backgroundColor: variant === 'modern' ? colors.neutral400 : colors.neutral100,
    borderRadius: 20,
    opacity: 1,
  },
}))

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange, variant = 'default', disabled = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <StyledSwitch 
      variant={variant} 
      checked={checked} 
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default CustomSwitch
