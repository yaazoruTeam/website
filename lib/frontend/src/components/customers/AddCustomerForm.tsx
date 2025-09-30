import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../designComponent/Button'
import { useTranslation } from 'react-i18next'
import {
  FormContainer,
  OuterCard,
  InnerContent,
  FieldsRow,
  AddressRow,
} from '../designComponent/styles/customersStyles'
import { validatePhoneNumber } from '../../utils/phoneValidate'
import {
  ChatModalContainer,
  ChatModalOverlay,
  CustomerCommentsSection,
  CustomerFormButtonSection,
} from '../designComponent/styles/chatCommentCardStyles'
import ChatCommentCard from '../designComponent/ChatCommentCard'
import ArrowToChatComments from '../designComponent/ArrowToChatComments'
import ChatBot from '../ChatBot/ChatBot'
import { EntityType } from '@model'

interface AddCustomerFormProps {
  onSubmit: (data: AddCustomerFormInputs) => void
  initialValues?: AddCustomerFormInputs
  setSubmitHandler?: (submit: () => void) => void
  customerId?: string
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
}

export interface AddCustomerFormInputs {
  first_name: string
  last_name: string
  id_number: string
  phone_number: string
  additional_phone: string
  email: string
  address: string
  city: string
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onSubmit,
  initialValues,
  setSubmitHandler,
  customerId,
  lastCommentDate,
  lastComment,
  onCommentsRefresh,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { control, handleSubmit } = useForm<AddCustomerFormInputs>({
    defaultValues: initialValues || {
      first_name: '',
      last_name: '',
      id_number: '',
      phone_number: '',
      additional_phone: '',
      email: '',
      address: '',
      city: '',
    },
  })

  useEffect(() => {
    if (setSubmitHandler) {
      setSubmitHandler(handleSubmit(onSubmit))
    }
  }, [handleSubmit, onSubmit, setSubmitHandler])

  const isMobile = useMediaQuery('(max-width:600px)')
  const hasInitialValues = !!initialValues

  return (
    <FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
      <OuterCard>
        <InnerContent>
          {/* --- Row 1 --- */}
          <FieldsRow isMobile={isMobile}>
            <CustomTextField
              name='first_name'
              label={t('firstName')}
              rules={{
                required: t('requiredField'),
                maxLength: {
                  value: 50,
                  message: t('maxLength', { max: 50 }),
                },
                pattern: {
                  value: /^[A-Za-zא-ת\s'-]+$/,
                  message: t('invalidName'),
                },
              }}
              control={control}
            />
            <CustomTextField
              control={control}
              name='last_name'
              label={t('lastName')}
              rules={{
                required: t('requiredField'),
                maxLength: {
                  value: 50,
                  message: t('maxLength', { max: 50 }),
                },
                 pattern: {
                  value: /^[A-Za-zא-ת\s'-]+$/,
                  message: t('invalidName'),
                },
              }}
            />
            <CustomTextField
              control={control}
              name='id_number'
              label={t('IdNumber')}
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^\d{9}$/,
                  message: t('errorIdNumber'),
                },
              }}
            />
          </FieldsRow>

          {/* --- Row 2 --- */}
          <FieldsRow isMobile={isMobile}>
            <CustomTextField
              control={control}
              name='phone_number'
              label={t('phone')}
              rules={{
                required: t('requiredField'),
                validate: (value: string) => validatePhoneNumber(value, t),
              }}
            />
            <CustomTextField
              control={control}
              name='additional_phone'
              label={t('additionalPhone')}
              rules={{
                validate: (value: string) =>
                  value ? validatePhoneNumber(value, t) : true,
              }}
            />
            <CustomTextField
              control={control}
              name='email'
              label={t('email')}
              type='email'
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('errorEmail'),
                },
              }}
            />
          </FieldsRow>

          {/* --- Address --- */}
          <AddressRow isMobile={isMobile}>
            <CustomTextField
              control={control}
              name='address'
              label={t('address')}
              rules={{
                required: t('requiredField'),
                pattern: {
                  value: /^[A-Za-zא-ת0-9\s'",.\-/]+$/,
                  message: t('invalidAddress'),
                },
              }}
            />
            <CustomTextField
              control={control}
              name='city'
              label={t('city')}
              rules={{
                required: t('requiredField'),
                 pattern: {
                  value: /^[A-Za-zא-ת\s'-]+$/,
                  message: t('invalidCity'),
                },
              }}
            />
          </AddressRow>

          {/* --- Comments --- */}
          <CustomerCommentsSection>
            <ChatCommentCard
              commentsType={t('customerComments')}
              lastCommentDate={lastCommentDate || ''}
              lastComment={lastComment || t('noPreviousComments')}
              chatButton={<ArrowToChatComments onClick={() => setIsChatOpen(true)} />}
            />
          </CustomerCommentsSection>

          {/* --- Save Button --- */}
          {!hasInitialValues && (
            <CustomerFormButtonSection>
              <CustomButton
                label={t('saving')}
                state='default'
                size={isMobile ? 'small' : 'large'}
                buttonType='first'
                type='submit'
              />
            </CustomerFormButtonSection>
          )}
        </InnerContent>
      </OuterCard>

      {/* --- Chat Modal --- */}
      {isChatOpen && customerId && (
        <ChatModalOverlay
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false)
              if (onCommentsRefresh) onCommentsRefresh()
            }
          }}
        >
          <ChatModalContainer>
            <ChatBot
              entityType={EntityType.Customer}
              entityId={customerId}
              onClose={() => {
                setIsChatOpen(false)
                if (onCommentsRefresh) onCommentsRefresh()
              }}
              commentType={t('customerComments')}
            />
          </ChatModalContainer>
        </ChatModalOverlay>
      )}
    </FormContainer>
  )
}

export default AddCustomerForm