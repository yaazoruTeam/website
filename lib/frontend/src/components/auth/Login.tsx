import React, { useEffect } from 'react'
import loginImage from '../../assets/loginImage.svg'
import LoginForm from './LoginForm'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/authApi'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'

interface LoginFormInputs {
  username: string
  password: string
}

const Login2222: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // בדיקה אם כבר יש טוקן - אם כן, לכוון למקום הנכון
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = async (data: LoginFormInputs) => {
    console.log('Form Data:', data)
    try {
      const userPayload = {
        user_name: data.username,
        password: data.password,
      }
      const response = await login(userPayload)
      console.log('response after login:', response)
      const token = response
      localStorage.setItem('token', token)
      navigate('/')
    } catch (error) {
      console.error('Login failed', error)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100%',
        backgroundColor: colors.c2,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          width: '70%',
          height: '100%',
          position: 'relative',
          backgroundColor: colors.c15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4%',
        }}
      >
        <CustomTypography
          text={t('loginSystem')}
          variant='h1'
          weight='bold'
          color={colors.c11}
          sx={{
            position: 'absolute',
            top: '8%',
            right: '10%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '75%',
            maxWidth: '500px',
            height: 'auto',
            zIndex: 5,
          }}
        >
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '5%',
          width: '35%',
          height: 'auto',
          zIndex: 10,
        }}
      >
        <img
          src={loginImage}
          alt='img'
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  )
}

export default Login2222
