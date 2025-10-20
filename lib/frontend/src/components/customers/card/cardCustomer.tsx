import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Customer } from '@model'
import { deleteCustomer, getCustomerById, updateCustomer } from '../../../api/customerApi'
import CustomTypography from '../../designComponent/Typography'
import { colors } from '../../../styles/theme'
import { Box, useMediaQuery } from '@mui/system'
import { formatDateToString } from '../../designComponent/FormatDate'
import { CustomButton } from '../../designComponent/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import CustomTabs from '../../designComponent/Tab'
import DeviceDetails from './deviceDetails'
import MonthlyPaymentDetails from './monthlyPaymentDetails'
import CustomerDetails, { CustomerDetailsRef } from './customerDetails'
import CustomModal from '../../designComponent/Modal'

const CardCustomer: React.FC = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [customer, setCustomer] = useState<Customer.Model>()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [openModal, setOpenModal] = useState(false)
  const formRef = useRef<CustomerDetailsRef>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getCustomer = async (id: string) => {
      const customerData = await getCustomerById(id)
      setCustomer(customerData)
    }

    if (id) {
      getCustomer(id)
    }
  }, [id])

  const savingChanges = () => {
    if (formRef.current) {
      formRef.current.submitForm()
    }
  }

  const handleCustomerUpdate = async (customerData: Partial<Customer.Model>) => {
    if (!customerData || !customer?.customer_id) {
      console.warn('No customer data available to save')
      return
    }
    
    try {
      // מעדכנים את הלקוח עם הנתונים החדשים
      const updatedData = {
        ...customer,
        ...customerData,
        customer_id: customer.customer_id
      }
      
      await updateCustomer(Number(customer.customer_id), updatedData as Customer.Model)
      console.log('Customer updated successfully')
      
      // מעדכן את ה-state המקומי עם הנתונים החדשים
      setCustomer(updatedData as Customer.Model)
    } catch (error) {
      console.error('Error updating customer:', error)
      // כאן אפשר להוסיף הודעת שגיאה למשתמש
    }
  }

  const deletingCustomer = async () => {
    console.log('delete customer: ', customer?.customer_id)
    if (customer) await deleteCustomer(parseInt(customer.customer_id))
    setOpenModal(false)
    navigate('/customers')
  }

  return (
    <>
      <Box
        sx={{
          direction: 'rtl',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          marginTop: '40px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CustomTypography
            text={customer ? `${customer.first_name} ${customer.last_name}` : ''}
            variant='h1'
            weight='bold'
            color={colors.blue900}
          />
          <CustomTypography
            text={customer ? `${t('addedOn')} ${formatDateToString(customer.created_at)}` : ''}
            variant='h3'
            weight='regular'
            color={colors.blue900}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            direction: 'rtl',
          }}
        >
          <CustomButton
            label={t('deletingCustomer')}
            size={isMobile ? 'small' : 'large'}
            state='default'
            buttonType='third'
            icon={<TrashIcon />}
            onClick={() => setOpenModal(true)}
            disabled={customer?.status === 'inactive'}
          />
          <CustomButton
            label={t('savingChanges')}
            size={isMobile ? 'small' : 'large'}
            state='default'
            buttonType='first'
            onClick={savingChanges}
          />
        </Box>
      </Box>
      <Box
        sx={{
          my: '28px',
        }}
      >
        <CustomTabs
          tabs={[
            {
              label: t('customerDetails'),
              content: customer ? <CustomerDetails ref={formRef} customer={customer} onCustomerUpdate={handleCustomerUpdate} /> : '',
            },
            {
              label: t('devicesAndQuestions'),
              content: customer ? <DeviceDetails customer={customer} /> : '',
            },
            {
              label: t('standingOrders'),
              content: customer ? <MonthlyPaymentDetails customer={customer} /> : '',
            },
          ]}
        />
      </Box>
      <CustomModal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            direction: 'rtl',
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <CustomTypography
            text={t('deletingCustomer')}
            variant='h1'
            weight='medium'
            color={colors.blue900}
          />
          <CustomTypography
            text={t('customerDeletionWarning')}
            variant='h3'
            weight='medium'
            color={colors.blue900}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            gap: 2,
            width: '100%',
          }}
        >
          <CustomButton
            label={t('approval')}
            size={isMobile ? 'small' : 'large'}
            buttonType='first'
            state='default'
            onClick={deletingCustomer}
          />
          <CustomButton
            label={t('cancellation')}
            size={isMobile ? 'small' : 'large'}
            buttonType='second'
            state='hover'
            onClick={() => setOpenModal(false)}
          />
        </Box>
      </CustomModal>
    </>
  )
}

export default CardCustomer
