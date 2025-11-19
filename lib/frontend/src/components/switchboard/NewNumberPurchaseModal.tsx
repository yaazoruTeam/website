import { useState } from 'react'
import { colors } from '../../styles/theme'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Box, Divider } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import CustomSelect from '../designComponent/CustomSelect'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { Switchboard, CreateDidRequest, Widely } from '@model'
import CountrySelectionModal from './CountrySelectionModal'
import { createDid } from '../../api/widely'
import { extractNumberFromWidelyResponse } from '../../utils/numberExtractor'

interface NewNumberPurchaseModalProps {
  open: boolean
  onClose: () => void
}

// Using the same form data type from the model
type FormData = Switchboard.PurchasingNumberFormData

const NewNumberPurchaseModal: React.FC<NewNumberPurchaseModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const { control, handleSubmit, setValue, watch } = useForm<FormData>({})
  const [openCountryModal, setOpenCountryModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
    icon: React.ReactElement;
  } | null>(null)
  const [isLoadingNumber, setIsLoadingNumber] = useState(false)
  const [newDidNumber, setNewDidNumber] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Watch the form values to enable/disable the button
  const selectedType = watch('target')
  const isFormValid = selectedType && selectedCountry
  
  const typeOptions = [
    { label: t('landline') || 'נייח', value: 'landline' },
    { label: t('mobile') || 'נייד', value: 'mobile' },
    { label: t('kosherNumber') || 'מספר כשר', value: 'kosher' },
  ]

  const handleCountrySelect = (country: { label: string; value: string; icon: React.ReactElement }) => {
    setSelectedCountry(country)
    setValue('notifyEmailCalls', country.value)
    // Reset previous number and error when country changes
    setNewDidNumber(null)
    setErrorMessage(null) 
  }

  const handleGetNewNumber = async () => {
    
    if (!selectedType || !selectedCountry) {
      setErrorMessage(t('pleaseSelectTypeAndCountry') || 'נא לבחור סוג ומדינה')
      return
    }

    setIsLoadingNumber(true)
    setErrorMessage(null)
    setNewDidNumber(null)

    try {
      const requestData: CreateDidRequest = {
        purchase_type: 'new',
        country: selectedCountry.value,
        type: selectedType as 'mobile' | 'landline' | 'kosher',
        domain_user_id: 0 // This will be overridden by backend with env variable
      }
      
      const response = await createDid(requestData)      
      // Check if response is successful based on WIDELY API format
      if (response && response.error_code === 200) {
        // Extract the DID number using the utility function
        const extractedNumber = extractNumberFromWidelyResponse(
          response as Widely.Model, 
          selectedCountry.value
        )
        
        if (extractedNumber) {
          setNewDidNumber(extractedNumber)
        } else {
          setNewDidNumber(t('numberCreatedSuccessfully') || 'מספר נוצר בהצלחה')
        }
      } else {
        setErrorMessage(`${t('errorCreatingNumber') || 'שגיאה ביצירת המספר'}: ${response?.message || t('tryAgain') || 'נסה שוב'}`)
      }
    } catch {
      setErrorMessage(t('errorCreatingNumberTryAgain') || 'שגיאה ביצירת המספר. נסה שוב.')
    } finally {
      setIsLoadingNumber(false)
    }
  }

  const onSubmit = () => {
    // TODO: Implement the actual purchase logic
    onClose()
  }

  return (
    <>
      <CountrySelectionModal
        open={openCountryModal}
        onClose={() => setOpenCountryModal(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry?.value}
      />
      <CustomModal open={open} onClose={onClose} maxWidth='380px' padding='16px'>
      <Box sx={{ 
        width: '100%', 
        maxHeight: '70vh', 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <CustomTypography
            text={t('purchasingNewNumber') || 'רכישת מספר חדש'}
            variant='h3'
            weight='bold'
            color={colors.blue600}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Type Selection */}
          <Box>
            <CustomSelect
              control={control}
              name='target'
              label={t('typeSelection') || 'בחירת סוג'}
              options={typeOptions}
            />
          </Box>

          {/* Country */}
          <Box>
            <CustomTypography 
              text={t('country') || 'מדינה'}
              variant='h4' 
              weight='regular'
              sx={{ mb: 1, textAlign: 'right', color: colors.neutral600 }}
            />
            <Box
              onClick={() => setOpenCountryModal(true)}
              sx={{
                border: `1px solid ${colors.neutral300}`,
                borderRadius: 1,
                p: 1.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                minHeight: '40px',
                '&:hover': {
                  borderColor: colors.blue400,
                },
                '&:focus': {
                  borderColor: colors.blue500,
                  outline: 'none',
                },
                direction: 'rtl'
              }}
              tabIndex={0}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selectedCountry ? (
                  <>
                    {selectedCountry.icon}
                    <CustomTypography
                      text={selectedCountry.label}
                      variant='h4'
                      weight='regular'
                    />
                  </>
                ) : (
                  <CustomTypography
                    text={t('selectCountry') || 'בחר מדינה'}
                    variant='h4'
                    weight='regular'
                    color={colors.neutral400}
                  />
                )}
              </Box>
              {/* Dropdown Arrow */}
              <Box
                sx={{
                  width: '0',
                  height: '0',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: `4px solid ${colors.neutral400}`,
                  ml: 1
                }}
              />
            </Box>
          </Box>

          {/* Get New Number Button */}
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <CustomButton
              label={isLoadingNumber ? (t('gettingNumber') || 'מקבל מספר...') : (t('getNewNumberFromWIDELY') || 'קבלת מספר חדש מ-WIDELY')}
              buttonType='second'
              state='default'
              onClick={handleGetNewNumber}
              disabled={!isFormValid || isLoadingNumber}
            />
          </Box>

          {/* Display New Number or Error */}
          {newDidNumber && (
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              backgroundColor: colors.green75, 
              borderRadius: 1,
              border: `1px solid ${colors.green500}`
            }}>
              <CustomTypography
                text={`${t('newNumber') || 'מספר חדש'}: ${newDidNumber}`}
                variant='h4'
                weight='bold'
                color={colors.green500}
              />
            </Box>
          )}

          {errorMessage && (
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              backgroundColor: colors.red75, 
              borderRadius: 1,
              border: `1px solid ${colors.red500}`
            }}>
              <CustomTypography
                text={errorMessage}
                variant='h4'
                weight='regular'
                color={colors.red500}
              />
            </Box>
          )}

          {/* Target */}
          <Box>
            <CustomTextField
              control={control}
              name='SMSToEmail'
              label={t('target') || 'יעד'}
              placeholder={t('enterNumber') || 'הקלד מספר'}
            />
          </Box>

          {/* Additional Target */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label={t('additionalTarget') || 'יעד נוסף'}
              placeholder={t('selectNumber') || 'בחר מספר'}
            />
          </Box>

          {/* Notes */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label={t('notes') || 'הערות'}
              placeholder={t('enterNote') || 'הקלד הערה'}
            />
          </Box>

          {/* SMS to Email */}
          <Box>
            <CustomTextField
              control={control}
              name='SMSToEmail'
              label={t('smsToEmail') || 'לקבלת SMS למייל'}
              placeholder={t('emailPlaceholder') || 'example@email.com'}
            />
          </Box>

          {/* Email Notifications for All Calls */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label={t('notifyEmailCalls') || 'להודיע במייל על כל השיחות'}
              placeholder={t('emailPlaceholder') || 'example@email.com'}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1.5,
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${colors.neutral200}`,
          }}
        >
          <CustomButton
            label={t('cancellation') || 'ביטול'}
            buttonType='third'
            state='default'
            onClick={onClose}
          />
          <CustomButton
            label={t('savingChanges') || 'שמירת שינויים'}
            buttonType='second'
            state='default'
            onClick={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </CustomModal>
    </>
  )
}

export default NewNumberPurchaseModal