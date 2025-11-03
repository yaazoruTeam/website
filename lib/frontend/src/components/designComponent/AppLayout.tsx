import React from 'react'
import { Box } from '@mui/material'
import ReturnButton from '../designComponent/ReturnButton'

interface AppLayoutProps {
  children: React.ReactNode
  SideNavOpen?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, SideNavOpen = false }) => {
  return (
    <Box
      sx={{
        paddingLeft: SideNavOpen ? '40px' : '80px',
        paddingRight: SideNavOpen ? '40px' : '80px',
        paddingTop: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        transition: 'padding 0.3s ease-in-out',
        '@media (min-width: 768px)': {
          paddingLeft: SideNavOpen ? '60px' : '80px',
          paddingRight: SideNavOpen ? '26px' : '60px',
        },
        '@media (min-width: 1200px)': {
          paddingLeft: SideNavOpen ? '80px' : '120px',
          paddingRight: SideNavOpen ? '40px' : '90px',
        },
      }}
    >
      <ReturnButton />
      {children}
    </Box>
  )
}
