import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'

import './App.css'
import SideNav from './components/layout/SideNav'

import Dashboard from './components/dashboard/dashboard'
import Customers from './components/customers/customers'
import Devices from './components/devices/devices'
import Header from './components/layout/Header'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import MonthlyPaymentComponen from './components/monthlyPayment/MonthlyPayment'
import Orders from './components/orders/Orders'
import Branches from './components/branches/Branches'
import Permissions from './components/Permissions/Permissions'
import ProtectedRoute from './components/ProtectedRoute'
import Switchboard from './components/switchboard/Switchboard'

import dashboardIconWhite from '../src/assets/dashboardIcon-white.svg'
import dashboardIconBlue from '../src/assets/dashboardIcon-blue.svg'
import customerIconWhite from '../src/assets/customerIcon-white.svg'
import customerIconBlue from '../src/assets/customerIcon-blue.svg'
import devicesIconWhite from '../src/assets/deviceIcon-white.svg'
import devicesIconBlue from '../src/assets/deviceIcon-blue.svg'
import ordersIconWhite from '../src/assets/orders-white.svg'
import ordersIconBlue from '../src/assets/orders-blue.svg'
import branchesIconWhite from '../src/assets/branches-white.svg'
import branchesIconBlue from '../src/assets/branches-blue.svg'
import monthlyPaymentIconWhite from '../src/assets/monthlyPayment-white.svg'
import monthlyPaymentIconBlue from '../src/assets/monthlyPayment-blue.svg'
import permissionsIconWhite from '../src/assets/permissions-white.svg'
import permissionsIconBlue from '../src/assets/permissions-blue.svg'
import switchboardIconWhite from '../src/assets/switchboard-white.svg'
import switchboardIconBlue from '../src/assets/switchboard-blue.svg'

import { setupAxiosInterceptors } from './api/axiosInterceptor'
import { colors, theme } from './styles/theme'
import { useTranslation } from 'react-i18next'
import EditMonthlyPayment from './components/monthlyPayment/EditMonthlyPayment'
import CardCustomer from './components/customers/card/cardCustomer'
import CallCenter from './components/switchboard/CallCenter'
import CallLog from './components/switchboard/CallLog'
import { AppLayout } from './components/designComponent/AppLayout'
import DeviceCard from './components/devices/deviceCard'
import AddCustomer from './components/customers/AddCustomer'
import ExcelUpload from './components/excel/ExcelUpload'
import SimReset from './components/devices/SimReset'

function App() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    setupAxiosInterceptors(navigate)
  }, [navigate])

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* עמודים ללא הגנה */}
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* עמודים מוגנים עם Header ו-SideNav */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <>
                <Header />
                <div style={{ display: 'flex' }}>
                  <SideNav
                    listItems={[
                      {
                        iconWhite: dashboardIconWhite,
                        iconBlue: dashboardIconBlue,
                        link: '../dashboard',
                        text: t('dashboard'),
                      },
                      {
                        iconWhite: customerIconWhite,
                        iconBlue: customerIconBlue,
                        link: '../customers',
                        text: t('customers'),
                      },
                      {
                        iconWhite: devicesIconWhite,
                        iconBlue: devicesIconBlue,
                        link: '../devices',
                        text: t('devices'),
                      },
                      {
                        iconWhite: devicesIconWhite,
                        iconBlue: devicesIconBlue,
                        link: '../sim-reset',
                        text: t('simReset'),
                      },
                      {
                        iconWhite: ordersIconWhite,
                        iconBlue: ordersIconBlue,
                        link: '../orders',
                        text: t('orders'),
                      },
                      {
                        iconWhite: branchesIconWhite,
                        iconBlue: branchesIconBlue,
                        link: '../branches',
                        text: t('branches'),
                      },
                      {
                        iconWhite: monthlyPaymentIconWhite,
                        iconBlue: monthlyPaymentIconBlue,
                        link: '../monthlyPayment',
                        text: t('standingOrder'),
                      },
                      {
                        iconWhite: switchboardIconWhite,
                        iconBlue: switchboardIconBlue,
                        link: '../switchboard',
                        text: t('switchboard'),
                      },
                      {
                        iconWhite: permissionsIconWhite,
                        iconBlue: permissionsIconBlue,
                        link: '../permissions',
                        text: t('permissions'),
                      },
                    ]}
                  />
                  <main
                    style={{
                      flexGrow: 1,
                      padding: '20px',
                      overflow: 'auto',
                      background: colors.neutral75,
                      marginRight: '130px', // רוחב ה-SideNav
                    }}
                  >
                    <AppLayout>
                      <Routes>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/customers' element={<Customers />} />
                        <Route path='/customer/add' element={<AddCustomer />} />
                        <Route path='/customer/card/:id' element={<CardCustomer />} />
                        <Route path='/devices' element={<Devices />} />
                        <Route path='/device/card/:id' element={<DeviceCard />} />
                        <Route path='/sim-reset' element={<SimReset />} />
                        <Route path='/orders' element={<Orders />} />
                        <Route path='/branches' element={<Branches />} />
                        <Route path='/monthlyPayment' element={<MonthlyPaymentComponen />} />
                        <Route path='/monthlyPayment/edit/:id' element={<EditMonthlyPayment />} />
                        <Route path='/excel' element={<ExcelUpload />} />
                        <Route path='/permissions' element={<Permissions />} />
                        <Route path='/switchboard' element={<Switchboard />} />
                        <Route path='/switchboard/callCenter/:id' element={<CallCenter />} />
                        <Route path='/switchboard/callCenter/:id/callLog/:callId' element={<CallLog />} />
                      </Routes>
                    </AppLayout>
                  </main>
                </div>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
