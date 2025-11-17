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
import { Switchboard } from '@model'
import CountrySelectionModal from './CountrySelectionModal'

interface NewNumberPurchaseModalProps {
  open: boolean
  onClose: () => void
}

// Using the same form data type from the model
type FormData = Switchboard.PurchasingNumberFormData

const NewNumberPurchaseModal: React.FC<NewNumberPurchaseModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const { control, handleSubmit, setValue } = useForm<FormData>({})
  const [openCountryModal, setOpenCountryModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
    icon: React.ReactElement;
  } | null>(null)

  const typeOptions = [
    { label: 'נייח', value: 'landline' },
    { label: 'נייד', value: 'mobile' },
    { label: 'מספר כשר', value: 'kosher' },
  ]

  const handleCountrySelect = (country: { label: string; value: string; icon: React.ReactElement }) => {
    setSelectedCountry(country)
    setValue('notes', country.value)
  }

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
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
              label='בחירת סוג'
              options={typeOptions}
            />
          </Box>

          {/* Country */}
          <Box>
            <CustomTypography 
              text='מדינה'
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
                    text='בחר מדינה'
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

          {/* Target */}
          <Box>
            <CustomTextField
              control={control}
              name='SMSToEmail'
              label='יעד'
              placeholder='הקלד מספר'
            />
          </Box>

          {/* Additional Target */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label='יעד נוסף'
              placeholder='בחר מספר'
            />
          </Box>

          {/* Notes */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label='הערות'
              placeholder='הקלד הערה'
            />
          </Box>

          {/* SMS to Email */}
          <Box>
            <CustomTextField
              control={control}
              name='SMSToEmail'
              label='לקבלת SMS למייל'
              placeholder='example@email.com'
            />
          </Box>

          {/* Email Notifications for All Calls */}
          <Box>
            <CustomTextField
              control={control}
              name='notifyEmailCalls'
              label='להודיע במייל על כל השיחות'
              placeholder='example@email.com'
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