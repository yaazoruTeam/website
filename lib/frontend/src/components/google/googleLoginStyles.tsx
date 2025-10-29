import { styled } from '@mui/material'
import { colors } from '../../styles/theme'
import { FlexBase } from '../designComponent/styles/baseStyles'

// Google Login specific styled components
export const GoogleLoginButton = styled('button')<{ isLoading?: boolean; isDisabled?: boolean }>(({ isLoading, isDisabled }) => ({
  width: '100%',
  fontWeight: 500,
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 16px',
  border: '1px solid #dadce0',
  backgroundColor: colors.neutral0,
  color: '#3c4043',
  fontSize: '14px',
  fontFamily: 'Roboto, arial, sans-serif',
  cursor: (isLoading || isDisabled) ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.5 : isLoading ? 0.8 : 1,
  minWidth: '200px',

  '&:hover': {
    ...(!(isLoading || isDisabled) && {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
      backgroundColor: '#f8f9fa',
    }),
  },

  '&:active': {
    ...(!(isLoading || isDisabled) && {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }),
  },

  // Mobile responsive
  '@media (max-width: 600px)': {
    minWidth: '100%',
    fontSize: '14px',
    padding: '10px 14px',
  },
}))

export const GoogleLoginLoadingSpinner = styled('div')({
  width: '16px',
  height: '16px',
  border: '2px solid #f3f3f3',
  borderTop: '2px solid #4285f4',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
})

export const GoogleLoginContent = styled(FlexBase)({
  gap: '8px',
})

export const GoogleLoginIcon = styled('img')({
  objectFit: 'contain',
})