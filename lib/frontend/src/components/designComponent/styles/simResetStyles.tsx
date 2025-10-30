import { styled } from '@mui/material'
import { Container, Card, CardContent, Box } from '@mui/material'
import { colors } from '../../../styles/theme'

// SimReset specific styled components
export const SimResetContainer = styled(Container)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '32px',
  paddingBottom: '32px',
})

export const SimResetCard = styled(Card)({
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  border: `1px solid ${colors.blue200}`,
})

export const SimResetCardContent = styled(CardContent)({
  padding: '32px',
})

export const SimResetHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
})

export const SimResetFormSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const SimResetDeviceInfoBox = styled(Box)({
  background: colors.blue50,
  border: `1px solid ${colors.blue300}`,
  borderRadius: '8px',
  padding: '16px',
  marginTop: '16px',
})

export const SimResetDeviceInfoContent = styled(Box)({
  marginTop: '8px',
})

export const SimResetErrorBox = styled(Box)({
  background: colors.red100,
  border: `1px solid ${colors.red500}`,
  borderRadius: '8px',
  padding: '12px',
  marginTop: '16px',
})

export const SimResetSuccessBox = styled(Box)({
  background: colors.green100,
  border: `1px solid ${colors.green500}`,
  borderRadius: '8px',
  padding: '12px',
  marginTop: '16px',
})

export const SimResetButtonContainer = styled(Box)({
  marginTop: '32px',
  display: 'flex',
  justifyContent: 'center',
})