import React from 'react'
import { Box } from '@mui/material'
import AddCustomerForm, { AddCustomerFormInputs } from './AddCustomerForm'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { addCustomer } from './addCustomerLogic'

const AddCustomer: React.FC = () => {
  const { t } = useTranslation()

  const handleAddCustomer = async (data: AddCustomerFormInputs) => {
    try {
      const newCustomer = await addCustomer(data)
      alert('הלקוח נוסף בהצלחה')
      console.log(newCustomer)
      window.location.reload()
    } catch (err: unknown) {
      if (err.status === 409) {
        alert(`שגיאה: מספר ת.ז או אימייל כבר קיימים`)
      }
      alert(`שגיאה: ${err}`)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '28px',
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: 3.5,
          display: 'flex',
          width: '100%',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            gap: 3.5,
            display: 'flex',
            width: '100%',
          }}
        >
          <CustomTypography text={t('addCustomer')} variant='h1' weight='bold' color={colors.c8} />
        </Box>
      </Box>
      <AddCustomerForm onSubmit={handleAddCustomer} />
    </Box>
  )
}

export default AddCustomer
