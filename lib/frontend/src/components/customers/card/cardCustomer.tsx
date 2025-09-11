import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Customer, EntityType } from '@model'
import { deleteCustomer, getCustomerById } from '../../../api/customerApi'
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
import ArrowToChatComments from '../../designComponent/ArrowToChatComments'
import ChatBot from '../../ChatBot/ChatBot'

const CardCustomer: React.FC = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [customer, setCustomer] = useState<Customer.Model>()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [openModal, setOpenModal] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
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
      setTimeout(() => {
        const updatedCustomer = formRef.current?.getCustomerData()
        console.log(updatedCustomer) //הוספתי לוג כדי שלא תהייה שגיאה
        //כאן ניתן לשלוח את הנתונים לשרת
      }, 200)
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
          {/* רכיב החץ לצ'אט */}
          <Box sx={{ width: '60px', height: '60px' }}>
            <ArrowToChatComments onClick={() => setIsChatOpen(true)} />
          </Box>

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
              content: customer ? <CustomerDetails ref={formRef} customer={customer} /> : '',
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

      {/* Chat Modal */}
      {isChatOpen && customer && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // רקע כהה יותר
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'start', // מרכז המסך
            alignItems: 'center', // מרכז המסך אנכית
            padding: '20px', // רווח מהקצוות
          }}
          onClick={(e) => {
            // סגור את הצ'אט רק אם לוחצים על ה-overlay ולא על הצ'אט עצמו
            if (e.target === e.currentTarget) {
              setIsChatOpen(false)
            }
          }}
        >
          <Box
            sx={{
              marginTop: 38,
              marginRight: -3,
              backgroundColor: 'white',
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6, // פינות מעוגלות
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', // צל
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChatBot
              entityType={EntityType.Customer}
              entityId={String(customer.customer_id)} // המרה למחרוזת
              onClose={() => setIsChatOpen(false)}
            />
          </Box>
        </Box>
      )}
    </>
  )
}

export default CardCustomer
