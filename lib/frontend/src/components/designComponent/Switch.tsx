import React from 'react'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { CircularProgress, Box } from '@mui/material'
import { colors } from '../../styles/theme'

interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  variant?: 'default' | 'modern'
  disabled?: boolean
  loading?: boolean
}

const StyledSwitch = styled(Switch)<{ variant?: 'default' | 'modern'; loading?: boolean }>(({ variant = 'default', loading = false }) => ({
  width: 44,
  height: 22,
  padding: 0,
  display: 'flex',
  opacity: loading ? 0.7 : 1, // קצת שקיפות במצב טעינה
  transition: 'opacity 0.3s ease',
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: colors.c6,
      '& .MuiSwitch-thumb': {
        backgroundColor: variant === 'modern' ? colors.c6 : colors.c30,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: variant === 'modern' ? colors.c3 : colors.c12,
        opacity: 1,
      },
    },
    '&:not(.Mui-checked)': {
      transform: 'translateX(0px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: variant === 'modern' ? colors.c6 : colors.c28,
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
    backgroundColor: variant === 'modern' ? colors.n50 : colors.c12,
    borderRadius: 20,
    opacity: 1,
  },
}))

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange, variant = 'default', disabled = false, loading = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading && !disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <StyledSwitch 
        variant={variant} 
        checked={checked} 
        onChange={handleChange}
        // disabled={disabled} // רק disabled רגיל, לא במצב loading
      />
      {loading && (
        <CircularProgress 
          size={16} 
          sx={{ 
            color: variant === 'modern' ? colors.c3 : colors.c12,
            marginLeft: '4px'
          }} 
        />
      )}
    </Box>
  );
}

export default CustomSwitch
