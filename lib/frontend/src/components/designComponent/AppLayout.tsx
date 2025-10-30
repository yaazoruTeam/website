import React from 'react'
import { Box } from '@mui/material'
import ReturnButton from '../designComponent/ReturnButton'

interface AppLayoutProps {
  children: React.ReactNode
  isSideNavOpen?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, isSideNavOpen = false }) => {
  return (
    <Box
      sx={{
        paddingLeft: isSideNavOpen ? '40px' : '80px',
        paddingRight: isSideNavOpen ? '40px' : '80px',
        paddingTop: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        transition: 'padding 0.3s ease-in-out',
        '@media (min-width: 768px)': {
          paddingLeft: isSideNavOpen ? '60px' : '80px',
          paddingRight: isSideNavOpen ? '26px' : '60px',
        },
        '@media (min-width: 1200px)': {
          paddingLeft: isSideNavOpen ? '80px' : '120px',
          paddingRight: isSideNavOpen ? '40px' : '90px',
        },
      }}
    >
      <ReturnButton />
      {children}
    </Box>
  )
}
