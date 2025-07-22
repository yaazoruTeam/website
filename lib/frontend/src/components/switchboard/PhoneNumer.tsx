import { Box } from '@mui/material'
import CustomTypography from '../designComponent/Typography'
import usaIcon from '../../assets/USA.svg'
import israelIcon from '../../assets/Israel.svg'
import englandIcon from '../../assets/England.svg'

const PhoneNumber: React.FC<{ phoneNumber: string; country: 'USA' | 'Israel' | 'England' }> = ({
  phoneNumber,
  country,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        direction: 'rtl',
        gap: '8px',
      }}
    >
      {country === 'USA' ? (
        <img src={usaIcon} alt='USA' style={{ width: '20px', height: '16px' }} />
      ) : country === 'Israel' ? (
        <img src={israelIcon} alt='Israel' style={{ width: '20px', height: '16px' }} />
      ) : (
        <img src={englandIcon} alt='England' style={{ width: '20px', height: '16px' }} />
      )}
      <CustomTypography text={phoneNumber} weight='regular' variant='h4' />
    </Box>
  )
}

export default PhoneNumber
