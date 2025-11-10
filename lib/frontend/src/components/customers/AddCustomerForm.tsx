import React, { useEffect, useState, useCallback } from 'react'
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
import { EntityType, TempComment } from '@model'
import Box from '@mui/material/Box'

interface AddCustomerFormProps {
  // onSubmit now receives the form data and optional local comments written during creation
  onSubmit: (data: AddCustomerFormInputs, comments?: TempComment.Model[]) => void
  initialValues?: AddCustomerFormInputs
  setSubmitHandler?: (submit: () => void) => void
  customerId?: string
  lastCommentDate?: string
  lastComment?: string
  onCommentsRefresh?: () => Promise<void>
  onChatOpenChange?: (isOpen: boolean) => void
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
  onChatOpenChange,
}) => {
  const { t } = useTranslation()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [localComments, setLocalComments] = useState<TempComment.Model[]>([])

  // לוג כל פעם שההערות המקומיות משתנות
  useEffect(() => {
    console.log('📝 AddCustomerForm: הערות מקומיות עודכנו:', localComments.length, 'הערות');
    localComments.forEach((comment, index) => {
      console.log(`   ${index + 1}. "${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"`);
    });
  }, [localComments]);

  // עדכון הקומפוננטה האב כשהצ'אטבוט נפתח/נסגר
  useEffect(() => {
    if (onChatOpenChange) {
      onChatOpenChange(isChatOpen)
    }
  }, [isChatOpen, onChatOpenChange])

  // פונקציה לקביעת ההערה האחרונה שתוצג
  const getDisplayLastComment = () => {
    // אם יש lastComment (לקוח קיים), נחזיר אותו
    if (lastComment) return lastComment

    // אם זה לקוח חדש, נסתכל על ההערות המקומיות בטופס
    if (!customerId || customerId === 'temp-new-customer') {
      if (localComments.length > 0) return localComments[localComments.length - 1].content
    }

    // במקרה שאין הערות כלל
    return t('noPreviousComments')
  }

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

  const handleFormSubmit = useCallback((data: AddCustomerFormInputs) => {
    onSubmit(data, localComments);
  }, [localComments, onSubmit]);

  useEffect(() => {
    if (setSubmitHandler) {
      setSubmitHandler(handleSubmit(handleFormSubmit))
    }
  }, [handleSubmit, setSubmitHandler, handleFormSubmit])

  const isMobile = useMediaQuery('(max-width:600px)')
  const hasInitialValues = !!initialValues

  return (
    <FormContainer component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Box
        sx={{
          width: '100%',
          overflowX: isChatOpen ? 'auto' : 'visible',
          overflowY: 'visible',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#b0b0b0',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#909090',
            },
          },
        }}
      >
        <Box sx={{ 
          minWidth: isChatOpen ? 'max-content' : 'auto',
          maxWidth: isChatOpen ? 'calc(100vw )' : '100%',
        }}>
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
                  lastComment={getDisplayLastComment()}
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
        </Box>
      </Box>

      {/* --- Chat Modal --- */}
      {isChatOpen && (
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
              entityId={customerId || 'temp-new-customer'}
              onLocalCommentsChange={(c) => {
                setLocalComments(c.map(cc => ({
                  content: cc.content,
                  created_at: cc.created_at,
                  file_url: cc.file_url,
                  file_name: cc.file_name,
                  file_type: cc.file_type,
                })));
              }}
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