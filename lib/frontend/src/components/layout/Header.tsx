import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { colors } from '../../styles/theme'
import { Box } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../../api/userApi'
import CustomTypography from '../designComponent/Typography'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

const Header: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [token, setToken] = useState<string>('')
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      getUserFromToken(token)
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const getUserFromToken = async (token: string) => {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      const user_id: string = decodedPayload.user_id
      const user = await getUserById(user_id)
      setUserName(user.first_name)
      return user
    } catch (error) {
      console.error('Error decoding token', error)
      return null
    }
  }
  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: colors.neutral0,
        height: '108px',
        boxShadow: 'none',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          // marginLeft: "2%",
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginLeft: '2%',
            marginRight: '8%',
          }}
        >
          <Box>
            <TextField
              variant='standard'
              placeholder={t('topNavigation-Search')}
              fullWidth
              sx={{
                marginRight: '15%',
                width: '100%',
                // height: '50px',
                borderRadius: '43px',
                backgroundColor: colors.blueOverlay100,
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInputBase-input': {
                  backgroundColor: 'transparent',
                  textAlign: 'right',
                  direction: 'rtl',
                  padding: '12px 16px',
                  fontSize: '18px',
                  fontFamily: 'Heebo',
                  fontWeight: 400,
                  color: colors.blue600,
                },
                '& input::placeholder': {
                  color: colors.blueOverlay650,
                  opacity: 1,
                },
                '@media (max-width: 600px)': {
                  width: '100%',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position='end'
                    sx={{
                      marginRight: '24px',
                    }}
                  >
                    <MagnifyingGlassIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: colors.blueOverlay700,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            {!token ? (
              <CustomButton
                label={t('login')}
                sx={{
                  background: colors.neutral0,
                  color: colors.blue900,
                  border: `1px ${colors.blueOverlay700} solid`,
                  '&:hover': {
                    background: '#f9fafc',
                  },
                }}
                onClick={() => navigate('/login')}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'start',
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
              >
                <Box
                  sx={{
                    marginLeft: '16px',
                    pt: 1,
                    pb: 1,
                    borderRadius: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                  onClick={handleLogout}
                >
                  <CustomTypography
                    text={t('logout')}
                    variant='h4'
                    weight='regular'
                    color={colors.blue500}
                  />
                  <ArrowRightStartOnRectangleIcon
                    style={{ width: '24px', height: '24px', color: colors.blue500 }}
                  />
                </Box>
                <Box
                  sx={{
                    marginLeft: '30px',
                    width: '45.5px',
                    height: '45.5px',
                    position: 'relative',
                    backgroundColor: colors.blue50,
                    borderRadius: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CustomTypography
                    text={userName ? userName?.charAt(0) : ''}
                    variant='h1'
                    weight='medium'
                    color={colors.blue600}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
