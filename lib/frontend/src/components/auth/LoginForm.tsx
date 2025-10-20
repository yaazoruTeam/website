import { Box, useMediaQuery } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import logo1 from '../../assets/logo1.svg'
import logo2 from '../../assets/logo2.svg'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../google/GoogleLoginButton'
import { GoogleSignInResult } from '../../services/googleAuthService'

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void
}

interface LoginFormInputs {
  username: string
  password: string
}

// Example usage of LoginForm component
// const handleLoginSubmit = (data: LoginFormInputs) => {
//   console.log('Login data submitted:', data)
//  // Perform login logic here
//
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm<LoginFormInputs>()
  const isMobile = useMediaQuery('(max-width:600px)')
  const navigate = useNavigate()

  const handleRegisterClick = () => {
    navigate('/register')
  }

  const handleGoogleSuccess = (result: GoogleSignInResult) => {
    const { firebaseUser, backendResult, backendError } = result
    
    console.log('🎉 Google Login successful!', firebaseUser.displayName)
    console.log('Backend result:', backendResult)
    
    if (backendResult?.token) {
      // Store the JWT token from backend - using single 'token' key for consistency
      localStorage.setItem('token', backendResult.token)
      
      // Navigate to dashboard
      navigate('/dashboard')
    } else if (firebaseUser) {
      // Fallback: use Firebase user info even if backend failed
      console.warn('Google auth succeeded but backend sync failed:', backendError)
      // You could create a temporary token or handle this case differently
      navigate('/dashboard')
    }
  }

  const handleGoogleError = (error: Error & { code?: string; userMessage?: string }) => {
    console.error('❌ Google Login failed:', error)
    alert(`Google login failed: ${error.userMessage || error.message}`)
  }

  return (
    <Box
      sx={{
        width: '80%',
        padding: 6,
        backgroundColor: colors.neutral0,
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2.5,
        display: 'inline-flex',
      }}
    >
      <Box
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8.65,
          display: 'flex',
        }}
      >
        <img style={{ width: 79.04, height: 33.53 }} src={logo1} alt='' />
        <img style={{ width: 47.19, height: 45.45 }} src={logo2} alt='' />
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CustomTextField
          control={control}
          name='username'
          label={t('userName')}
          // helperText: "Please enter your email",
          rules={{
            required: t('requiredField'),
          }}
        />
        <CustomTextField
          control={control}
          name='password'
          label={t('password')}
          type='password'
          // helperText: "Please enter your email",
          rules={{
            required: t('requiredField'),
            // minLength: {
            //   value: 6,
            //   message: "הסיסמה חייבת להיות לפחות 6 תווים"
            // }
          }}
        />
        <CustomTypography
          text={t('forgotPassword?')}
          variant='h3'
          weight='medium'
          color={colors.blue900}
          sx={{
            textAlign: 'right',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        />
        <Box
          onClick={handleRegisterClick}
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 1,
          }}
        >
          <CustomTypography
            text="צריך להירשם? לחץ כאן"
            variant='h3'
            weight='medium'
            color={colors.blue900}
            sx={{
              textDecoration: 'underline',
            }}
          />
        </Box>
      </Box>

      <CustomButton
        label={t('loginSystem')}
        size={isMobile ? 'small' : 'large'}
        state='default'
        buttonType='first'
        onClick={handleSubmit(onSubmit)}
      />
      
      {/* Divider between regular login and Google login */}
      <Box sx={{ width: '100%', my: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.neutral300 }} />
        <CustomTypography
          text={t('or')}
          variant='h3'
          weight='medium'
          color={colors.neutral500}
          sx={{ mx: 2 }}
        />
        <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.neutral300 }} />
      </Box>

      {/* Google Login Button */}
      <GoogleLoginButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useRedirect={isMobile} // Use redirect on mobile for better UX
      />
    </Box>
  )
}

export default LoginForm
