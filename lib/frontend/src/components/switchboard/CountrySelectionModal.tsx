import { useState } from 'react'
import { colors } from '../../styles/theme'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { Box, List, ListItem, TextField } from '@mui/material'
import usaIcon from '../../assets/USA.svg'
import israelIcon from '../../assets/Israel.svg'
import englandIcon from '../../assets/England.svg'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface CountryOption {
  label: string
  value: string
  icon: React.ReactElement
}

interface CountrySelectionModalProps {
  open: boolean
  onClose: () => void
  onSelect: (country: CountryOption) => void
  selectedCountry?: string
}

const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({ 
  open, 
  onClose, 
  onSelect,
  selectedCountry 
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const countries: CountryOption[] = [
    {
      label: 'ישראל',
      value: 'israel',
      icon: <img src={israelIcon} alt='ישראל' style={{ width: '20px', height: '15px' }} />,
    },
    {
      label: 'אנגליה',
      value: 'england', 
      icon: <img src={englandIcon} alt='אנגליה' style={{ width: '20px', height: '15px' }} />,
    },
    {
      label: 'שוויץ',
      value: 'switzerland',
      icon: <img src={usaIcon} alt='שוויץ' style={{ width: '20px', height: '15px' }} />,
    },
  ]

  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCountrySelect = (country: typeof countries[0]) => {
    onSelect(country)
    onClose()
  }

  return (
    <CustomModal open={open} onClose={onClose} maxWidth='300px' padding='16px'>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <CustomTypography
            text='בחר מדינה'
            variant='h3'
            weight='bold'
            color={colors.blue600}
          />
        </Box>

        {/* Search Field */}
        <Box sx={{ mb: 2, position: 'relative' }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='הקלד מדינה'
            variant='outlined'
            size='small'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingRight: '40px',
                direction: 'rtl'
              }
            }}
          />
          <MagnifyingGlassIcon 
            style={{ 
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: colors.neutral400,
              pointerEvents: 'none'
            }}
          />
        </Box>

        {/* Countries List */}
        <Box sx={{ maxHeight: '250px', overflow: 'auto' }}>
          <List sx={{ p: 0 }}>
            {filteredCountries.map((country) => (
              <ListItem
                key={country.value}
                onClick={() => handleCountrySelect(country)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  backgroundColor: selectedCountry === country.value ? colors.blue50 : 'transparent',
                  '&:hover': {
                    backgroundColor: colors.neutral100,
                  },
                  direction: 'rtl'
                }}
              >
                {country.icon}
                <CustomTypography
                  text={country.label}
                  variant='h4'
                  weight='regular'
                  color={selectedCountry === country.value ? colors.blue600 : colors.neutral700}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </CustomModal>
  )
}

export default CountrySelectionModal