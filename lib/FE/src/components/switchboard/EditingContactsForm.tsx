import { Box, IconButton } from '@mui/material'
import { useForm } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/24/outline'
import { CustomTextField } from '../designComponent/Input'
import { useTranslation } from 'react-i18next'
import { AddCustomerFormInputs } from '../customers/AddCustomerForm'
import { colors } from '../../styles/theme'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
interface EditingContactsFormProps {
  value: Partial<AddCustomerFormInputs>
  onChange: (data: Partial<AddCustomerFormInputs>) => void
}
const EditingContactsForm = forwardRef<any, EditingContactsFormProps>(
  ({ value, onChange }, ref) => {
    const { t } = useTranslation()
    const { control, watch, handleSubmit } = useForm<AddCustomerFormInputs>({
      defaultValues: value || {
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

    // --- שינוי: עדכון האב בכל שינוי בטופס ---
    useEffect(() => {
      const subscription = watch((values) => {
        onChange(values)
      })
      return () => subscription.unsubscribe()
    }, [watch, onChange])

    useImperativeHandle(ref, () => ({
      submitForm: () =>
        new Promise((resolve, reject) => {
          handleSubmit(
            (data) => resolve(data),
            (errors) => reject(errors),
          )()
        }),
    }))

    return (
      <Box
        style={{
          width: '70%',
          height: '100%',
          borderRadius: 12,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'inline-flex',
        }}
        sx={{
          direction: 'rtl',
        }}
      >
        <Box
          style={{
            alignSelf: 'stretch',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            display: 'flex',
          }}
        >
          <Box
            style={{
              alignSelf: 'stretch',
              height: '100%',
              paddingTop: 28,
              paddingBottom: 20,
              background: 'white',
              borderRadius: 6,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              gap: 28,
              display: 'flex',
            }}
          >
            <Box
              style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: 28,
                display: 'inline-flex',
              }}
            >
              <CustomTextField
                label={t('number')}
                name='number'
                placeholder='1'
                control={control}
                rules={{ required: t('requiredField') }}
                height='29px'
              />
              <CustomTextField
                label={t('directNumber')}
                name='directNumber'
                placeholder='1-973-964-0286'
                control={control}
                rules={{ required: t('requiredField') }}
                height='29px'
              />
              <CustomTextField
                label={t('target')}
                name='target'
                placeholder='054-8494926'
                control={control}
                rules={{ required: t('requiredField') }}
                height='29px'
              />
              <CustomTextField
                label={t('notes/name')}
                name='notes/name'
                placeholder='אבא'
                control={control}
                height='29px'
              />
              <IconButton
                onClick={() => console.log('נמחק')}
                sx={{
                  marginTop: 3,
                  marginRight: 2,
                  color: colors.c22,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <TrashIcon style={{ width: '24px', height: '24px' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  },
)

export default EditingContactsForm
