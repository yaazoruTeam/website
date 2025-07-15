import { Box } from '@mui/system'
import React from 'react'
import { colors } from '../../styles/theme'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
// import CustomTypography from '../designComponent/Typography'
// import StatusTag from '../designComponent/Status'
// import { CustomButton } from '../designComponent/Button'
// import CustomSwitch from '../designComponent/Switch'
// import { useMediaQuery } from '@mui/material'

export interface deviceFormInputs {
  SIM_number: string
  IMEI_1: string
  mehalcha_number: string
  model: string
  received_at: string //להוסיף את זה לטבלה מכשירים //תאריך קבלת המכשיר
  planEndDate: string //להוסיף את זה לטבלת מכשירים     //תאריך סיום התוכנית - 5 שנים מאז הקבלה של המכשיר
  filterVersion: string //להוסיף את זה לטבלת מכשירים//גרסת סינון
  deviceProgram: string //להוסיף את זה לטבלת מכשירים    //תכנית מכשיר
  notes: string //לבדות איך בדיוק לבצע את זה!
  //הערות מכשיר

  //נתוני סים

  //פרטים שקיימים כבר על מכשיר ולא צריך אותם כאן
  // device_id: string;
  // device_number: string;
  // status: string;
  // isDonator: boolean;
}

const DeviceForm: React.FC<{ initialValues?: deviceFormInputs }> = ({ initialValues }) => {
  const { t } = useTranslation()
  // const isMobile = useMediaQuery('(max-width:600px)')
  const { control } = useForm<deviceFormInputs>({
    defaultValues: initialValues || {
      SIM_number: '',
      IMEI_1: '',
      mehalcha_number: '',
      model: '',
      received_at: '',
      planEndDate: '',
      filterVersion: '',
      deviceProgram: '',
      notes: '',
    },
  })
  
  /* משתנים לחלק של נתוני SIM - בהערות לעת עתה
  const [isCameraAndGallery, setIsCameraAndGallery] = useState<boolean>(true)
  const [isApplications, setIsApplications] = useState<boolean>(true)
  const [isDeviceBlocked, setIsDeviceBlocked] = useState<boolean>(true)
  const [isActiveSIM, setIsActiveSIM] = useState<boolean>(true)
  */

  return (
    <Box
      sx={{
        backgroundColor: colors.c6,
        direction: 'rtl',
        padding: '28px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='SIM_number' label={t('SIM_number')} />
        <CustomTextField control={control} name='IMEI_1' label={t('IMEI_1')} />
        <CustomTextField control={control} name='mehalcha_number' label={t('mehalcha_number')} />
        <CustomTextField control={control} name='model' label={t('model')} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
          paddingBottom: '24px',
        }}
      >
        <CustomTextField control={control} name='received_at' label={t('dateReceiptDevice')} />
        <CustomTextField control={control} name='planEndDate' label={t('programEndDate')} />
        <CustomTextField control={control} name='filterVersion' label={t('filterVersion')} />
        <CustomTextField control={control} name='deviceProgram' label={t('deviceProgram')} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '28px',
        }}
      >
        <CustomTextField
          control={control}
          name='notes'
          label={t('deviceNotes')}
          placeholder={t('noCommentsYet')}
        />
      </Box>
    </Box>
  )
}

export default DeviceForm
