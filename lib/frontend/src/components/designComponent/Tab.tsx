import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'

const TabPanel: React.FC<{
  value: number
  index: number
  children: React.ReactNode
}> = ({ value, index, children }) => {
  return (
    <div
      role='tabpanel'
      style={{
        display: value === index ? 'block' : 'none',
      }} /*hidden={value !== index}*/
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

type CustomTabsProps = {
  tabs: { label: string; content: React.ReactNode }[]
  editingContacts?: boolean
  onActiveTabChange?: (index: number) => void
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, editingContacts, onActiveTabChange }) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    if (onActiveTabChange) {
      onActiveTabChange(newValue)
    }
  }

  const getColor = (index: number) => {
    if (editingContacts) {
      return activeTab === index ? colors.blue600 : colors.blueOverlay700
    }
    return activeTab === index ? colors.neutral800 : colors.blueOverlay700
  }

  return (
    <Box sx={{ width: '100%', direction: 'rtl', overflow: 'hidden' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label='custom styled tabs'
          TabIndicatorProps={{
            style: { backgroundColor: colors.blue600, height: '1px' },
          }}
          sx={{ display: 'flex', overflowX: 'auto' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              label={
                <CustomTypography
                  text={tab.label}
                  variant='h4'
                  weight={activeTab === index ? 'medium' : 'regular'}
                  color={getColor(index)}
                  sx={{
                    textAlign: editingContacts ? 'center' : 'right',
                    width: '100%',
                    display: 'block',
                  }}
                />
              }
              key={index}
              sx={{
                width: editingContacts ? '160px' : 200,
                height: 48,
                padding: 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottom: `1px ${colors.blueOverlay700} solid`,
                display: 'inline-flex',
                justifyContent: 'flex-end',
                gap: 5,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: colors.neutral0_67,
                },
                transition: 'all 0.3s ease',
                marginRight: '5px',
              }}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel value={activeTab} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  )
}

export default CustomTabs
