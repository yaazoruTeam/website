import { Box, useMediaQuery } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import logo1 from '../../assets/logo1.svg'
import logo2 from '../../assets/logo2.svg'
// import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'
// import GoogleLoginButton from '../google/GoogleLoginButton'
// import { GoogleSignInResult } from '../../services/googleAuthService'
import { validatePhoneNumber } from '../../utils/phoneValidate'
import React from 'react'

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void
}

interface LoginFormInputs {
  phone_number: number,
  password: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm<LoginFormInputs>()
  const isMobile = useMediaQuery('(max-width:600px)')
  // const navigate = useNavigate()
  // const [showLoginForm, setShowLoginForm] = React.useState(false)

  // const handleRegisterClick = () => {
  //   navigate('/register')
  // }

  // const handleToggleLoginForm = () => {
  //   setShowLoginForm(!showLoginForm)
  // }

  // const handleGoogleSuccess = (result: GoogleSignInResult) => {
  //   const { firebaseUser, backendResult, backendError } = result
    
  //   console.log('🎉 Google Login successful!', firebaseUser.displayName)
  //   console.log('Backend result:', backendResult)
    
  //   if (backendResult?.token) {
  //     // Store the JWT token from backend - using single 'token' key for consistency
  //     localStorage.setItem('token', backendResult.token)
      
  //     // Navigate to dashboard
  //     navigate('/dashboard')
  //   } else if (firebaseUser) {
  //     // Fallback: use Firebase user info even if backend failed
  //     console.warn('Google auth succeeded but backend sync failed:', backendError)
  //     // You could create a temporary token or handle this case differently
  //     navigate('/dashboard')
  //   }
  // }

  // const handleGoogleError = (error: Error & { code?: string; userMessage?: string }) => {
  //   console.error('❌ Google Login failed:', error)
  //   alert(`Google login failed: ${error.userMessage || error.message}`)
  // }

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

      {/* {!showLoginForm ? ( */}
      {/* <>
        {/* Google Login View - Default */}
      {/*   <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <CustomTypography
            text={t('loginSystem')}
            variant='h2'
            weight='bold'
            color={colors.neutral900}
            sx={{
              marginBottom: 2,
            }}
          />
          
          {/* Google Login Button */}
      {/*   <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useRedirect={isMobile}
          />

          {/* Toggle to Phone/Password Login */}
      {/*   <Box
            sx={{
              textAlign: 'center',
              cursor: 'pointer',
              marginTop: 2,
            }}
            onClick={handleToggleLoginForm}
          >
            {/* <CustomTypography
              text={t('loginNotThroughGoogle')}
              variant='h3'
              weight='medium'
              color={colors.blue900}
              sx={{
                textDecoration: 'underline',
              }}
            /> */}
      {/*   </Box>
        </Box>

        {/* Sign Up Link Outside */}
      {/*   <Box
          onClick={handleRegisterClick}
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 3,
          }}
        >
          {/* <CustomTypography
            text={t('registerButton')}
            variant='h3'
            weight='medium'
            color={colors.blue900}
            sx={{
              textDecoration: 'underline',
            }}
          /> */}
      {/*   </Box>
      </> */}
      {/* ) : ( */}
        <>
          {/* Phone & Password Login View */}
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
              name='phone_number'
              label={t('phoneNumber')}
              rules={{
                required: t('requiredField'),
                validate: (value: string | number) => validatePhoneNumber(String(value), t),
              }}
            />
            <CustomTextField
              control={control}
              name='password'
              label={t('password')}
              type='password'
              rules={{
                required: t('requiredField'),
              }}
            />
            {/* <CustomTypography
              text={t('forgotPassword?')}
              variant='h3'
              weight='medium'
              color={colors.blue900}
              sx={{
                textAlign: 'right',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            /> */}
          </Box>

          <CustomButton
            label={t('loginSystem')}
            size={isMobile ? 'small' : 'large'}
            state='default'
            buttonType='first'
            onClick={handleSubmit(onSubmit)}
          />

          {/* Toggle back to Google Login */}
          {/* <Box
            sx={{
              textAlign: 'center',
              cursor: 'pointer',
              marginTop: 2,
            }}
            onClick={handleToggleLoginForm}
          > */}
            {/* <CustomTypography
              text={t('loginThroughGoogle')}
              variant='h3'
              weight='medium'
              color={colors.blue900}
              sx={{
                textDecoration: 'underline',
              }}
            /> */}
          {/* </Box> */}
        </>
      {/* )} */}
    </Box>
  )
}

export default LoginForm
