import React from 'react'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <CustomTypography
      text={t('dashboard')}
      variant='h1'
      weight='bold'
    />
  )
}

export default Dashboard
