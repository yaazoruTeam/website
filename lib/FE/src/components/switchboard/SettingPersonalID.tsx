import { useTranslation } from 'react-i18next'
import CustomTypography from '../designComponent/Typography'
import CustomModal from '../designComponent/Modal'

interface SettingPersonalIDProps {
  open: boolean
  onClose: () => void
}

const SettingPersonalID: React.FC<SettingPersonalIDProps> = ({ open, onClose }) => {
  const { t } = useTranslation()

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomTypography text={t('settingPersonalID')} variant='h1' weight='medium' />
    </CustomModal>
  )
}

export default SettingPersonalID
