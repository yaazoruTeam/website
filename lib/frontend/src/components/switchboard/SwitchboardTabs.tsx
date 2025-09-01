import { Box, useMediaQuery } from '@mui/material'
import { colors } from '../../styles/theme'
import { CustomButton } from '../designComponent/Button'
import { useTranslation } from 'react-i18next'
import CustomTabs from '../designComponent/Tab'
import EditNumberForm from './EditNumberForm'
import EditingContacts from './EditingContacts'
import { useState } from 'react'

interface EditNumberFormData {
  target: string
  notes: string
  notifyEmailOfAllCalls: string
  toReceiveSMSToEmail: string
}

interface EditingContactsFormInputs {
  number: string
  directNumber: string
  target: string
  'notes/name': string
}

const SwitchboardTabs = () => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const { t } = useTranslation()
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

  const [formData, setFormData] = useState<{
    editNumber: EditNumberFormData
    speedDial: Partial<EditingContactsFormInputs>[]
  }>({
    editNumber: { target: '', notes: '', notifyEmailOfAllCalls: '', toReceiveSMSToEmail: '' },
    speedDial: [],
  })

  const handleFormChange = (key: 'editNumber' | 'speedDial', data: Partial<EditNumberFormData> | Partial<EditingContactsFormInputs>[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: data,
    }))
  }

  const handleSave = async () => {
    //to do:Here make a server call to update the data
    console.log('--- Saving Started ---')
    console.log(formData)
    console.log('--- Saving Finished ---')
  }

  const handleCancel = () => {
    //to do: cancel
  }
  const onReset = () => {
    //to do: reset the form edit contacts
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.c6,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        flexDirection: 'column',
        p: 4,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexShrink: 0,
          alignSelf: 'flex-end',
        }}
      >
        {activeTabIndex === 1 && (
          <CustomButton
            label={t('reset')}
            buttonType='third'
            state='default'
            size={isMobile ? 'small' : 'large'}
            onClick={onReset}
          />
        )}
        <CustomButton
          label={t('cancellation')}
          buttonType='third'
          state='default'
          size={isMobile ? 'small' : 'large'}
          onClick={handleCancel}
        />
        <CustomButton
          label={t('savingChanges')}
          buttonType='second'
          state='default'
          size={isMobile ? 'small' : 'large'}
          onClick={handleSave}
        />
      </Box>
      <CustomTabs
        tabs={[
          {
            label: t('editingNumber'),
            content: (
              <EditNumberForm
                value={formData.editNumber}
                onChange={(data) => handleFormChange('editNumber', data)}
              />
            ),
          },
          {
            label: t('speedDial'),
            content: (
              <EditingContacts
                value={Array.isArray(formData.speedDial) ? formData.speedDial : []}
                onChange={(data) => handleFormChange('speedDial', data)}
              />
            ),
          },
        ]}
        editingContacts={true}
        onActiveTabChange={setActiveTabIndex}
      />
    </Box>
  )
}

export default SwitchboardTabs
