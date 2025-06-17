import React from 'react'
import { Box, Paper, List, ListItem } from '@mui/material'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import CustomTypography from './Typography'

interface CityOptionsProps {
  cities: string[]
  onCitySelect: (city: string) => void
}

const CityOptions: React.FC<CityOptionsProps> = ({ cities, onCitySelect }) => {
  return (
    <Box>
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: 4,
          border: '1px solid rgba(11, 57, 81, 0.36)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: 'none',
          gridArea: '1 / 1',
          justifyContent: 'center',
          marginTop: -6.3,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: '100%',
            py: 1.5,
            paddingRight: 5.3,
            paddingTop: 1.8,
            borderRadius: 1,
          }}
        >
          <CustomTypography
            variant='h1'
            weight='regular'
            text='עיר לקוח'
            sx={{
              color: '#032B40',
              fontFamily: 'Heebo',
              fontSize: 16,
              textAlign: 'right',
            }}
          ></CustomTypography>
        </Box>

        <ChevronDownIcon
          style={{
            width: '16px',
            height: '16px',
            color: '#032B40',
            position: 'absolute',
            top: 16,
            left: 10,
            pointerEvents: 'none',
          }}
        />

        <List
          sx={{
            width: '100%',
            maxHeight: 300,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}
        >
          {cities.map((city, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1.5,
                paddingRight: 5.3,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                cursor: 'pointer',
              }}
              onClick={() => onCitySelect(city)}
            >
              <CustomTypography text={city} variant='h4' weight='regular' />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default CityOptions
