import React, { useEffect } from 'react'
import RegisterForm, { RegisterFormInputs } from './RegisterForm'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { register } from '../../api/authApi'
import { colors } from '../../styles/theme'

const Register: React.FC = () => {
  const navigate = useNavigate()

  // בדיקה אם כבר יש טוקן - אם כן, לכוון למקום הנכון
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleRegister = async (data: RegisterFormInputs) => {
    console.log('Form Data:', data)
    try {
      // מכין את הנתונים בפורמט הנדרש
      const userPayload = {
        user_id: '',
        first_name: data.first_name,
        last_name: data.last_name,
        id_number: data.id_number,
        phone_number: data.phone_number,
        additional_phone: '',
        email: data.email,
        city: data.city,
        address1: data.address1,
        address2: '',
        zipCode: data.zipCode || '',
        password: data.password,
        user_name: data.user_name,
        role: 'admin' as const,
        status: 'active'
      }

      const response = await register(userPayload)
      console.log('response after register:', response)
      
      alert('משתמש נוצר בהצלחה!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed', error)
      alert('ההרשמה נכשלה. אנא נסה שוב.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.c15,
        overflow: 'auto',
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <RegisterForm onSubmit={handleRegister} />
      </Box>
    </Box>
  )
}

export default Register
