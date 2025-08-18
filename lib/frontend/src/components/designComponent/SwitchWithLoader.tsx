import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import CustomSwitch from './Switch'
import CustomTypography from './Typography'
import { colors } from '../../styles/theme'

interface SwitchWithLoaderProps {
  checked: boolean
  onChange: (checked: boolean) => void
  variant?: 'default' | 'modern'
  disabled?: boolean
  loading?: boolean
  label: string
  error?: string | null
}

const SwitchWithLoader: React.FC<SwitchWithLoaderProps> = ({ 
  checked, 
  onChange, 
  variant = 'default', 
  disabled = false, 
  loading = false,
  label,
  error = null
}) => {
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        opacity: loading ? 0.8 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <Box sx={{ 
            // position: 'relative'
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            }}>
          <CustomSwitch 
            checked={checked} 
            onChange={onChange} 
            variant={variant}
            disabled={disabled || loading}
          />
          {loading && (
              <CircularProgress 
                size={12} 
                sx={{ 
                  color: variant === 'modern' ? colors.c3 : colors.c11,
                }} 
              />
          )}
        </Box>
        <CustomTypography
          text={label}
          variant="h5"
          weight="regular"
          color={colors.c0}
        />
      </Box>
      
      {/* הצגת הודעת שגיאה אם יש */}
      {error && (
        <Box sx={{ marginTop: 1, marginRight: 6 }}>
          <CustomTypography
            text={error}
            variant="h5"
            weight="regular"
            color={colors.c28} // צבע אדום לשגיאה
          />
        </Box>
      )}
    </Box>
  );
}

export default SwitchWithLoader
