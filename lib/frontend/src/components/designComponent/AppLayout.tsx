import React from 'react'
import { Box } from '@mui/material'
import ReturnButton from '../designComponent/ReturnButton'

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        paddingLeft: '80px', // Default for mobile & tablet
        paddingRight: '80px', // Default for mobile & tablet
        paddingTop: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        '@media (min-width: 1200px)': {
          paddingLeft: '120px', // Desktop
          paddingRight: '120px', // Desktop
        },
      }}
    >
      <ReturnButton />
      {children}
    </Box>
  )
}
