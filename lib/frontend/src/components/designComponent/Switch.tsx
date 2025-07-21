import React from 'react'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from '../../styles/theme'

interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

const StyledSwitch = styled(Switch)(() => ({
  width: 44,
  height: 22,
  padding: 0,
  display: 'flex',
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: colors.c6,
      '& .MuiSwitch-thumb': {
        backgroundColor: colors.c30,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: colors.c12,
        opacity: 1,
      },
    },
    '&:not(.Mui-checked)': {
      transform: 'translateX(0px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: colors.c28,
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
    backgroundColor: colors.c12,
    borderRadius: 20,
    opacity: 1,
  },
}))

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange }) => {
  return <StyledSwitch checked={checked} onChange={(e) => onChange(e.target.checked)} />
}

export default CustomSwitch
